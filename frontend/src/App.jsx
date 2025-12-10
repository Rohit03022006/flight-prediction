import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlane,
  FaCity,
  FaClock,
  FaMapMarkerAlt,
  FaChair,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSpinner,
  FaExchangeAlt,
  FaHistory,
  FaTrash,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [formData, setFormData] = useState({
    airline: "",
    source_city: "",
    departure_time: "",
    stops: "",
    arrival_time: "",
    destination_city: "",
    class: "",
    departure_date: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [chartType, setChartType] = useState("line"); 
  const [priceHistoryData, setPriceHistoryData] = useState([]);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const savedHistory = localStorage.getItem("flightPredictionHistory");
    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "flightPredictionHistory",
      JSON.stringify(predictionHistory)
    );
  }, [predictionHistory]);

  useEffect(() => {
    if (formData.departure_date && 
        formData.airline && 
        formData.source_city && 
        formData.destination_city) {
      fetchPriceHistory();
    }
  }, [formData.departure_date, formData.airline, formData.source_city, formData.destination_city]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      const newPrediction = {
        ...response.data,
        details: { ...formData },
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };

      setPrediction(newPrediction);

      const updatedHistory = [newPrediction, ...predictionHistory].slice(0, 10);
      setPredictionHistory(updatedHistory);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to get prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setFormData({
      ...formData,
      source_city: formData.destination_city,
      destination_city: formData.source_city,
    });
  };

  const clearHistory = () => {
    setPredictionHistory([]);
  };

  const fetchPriceHistory = async () => {
    if (!formData.departure_date) return;
    
    setChartLoading(true);
    try {
      const baseDate = new Date(formData.departure_date);
      const datePromises = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + i);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const predictionData = {
          ...formData,
          departure_date: dateStr
        };
        
        datePromises.push(
          axios.post(`${API_BASE_URL}/predict`, predictionData)
            .then(response => ({
              date: dateStr,
              price: response.data.prediction,
              day: getDayName(currentDate.getDay()),
              fullDate: currentDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })
            }))
            .catch(error => {
              console.error(`Error fetching prediction for ${dateStr}:`, error);
              return {
                date: dateStr,
                price: Math.round(5000 * (0.8 + Math.random() * 0.4)),
                day: getDayName(currentDate.getDay()),
                fullDate: currentDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })
              };
            })
        );
      }
      
      const results = await Promise.all(datePromises);
      setPriceHistoryData(results);
      
    } catch (err) {
      console.error("Error fetching price history:", err);
      generateFallbackPriceHistory();
    } finally {
      setChartLoading(false);
    }
  };

  const getDayName = (dayIndex) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  };

  const generateFallbackPriceHistory = () => {
    const baseDate = new Date(formData.departure_date);
    const basePrice = 4500; // Default base price
    const fallbackData = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      
      fallbackData.push({
        date: currentDate.toISOString().split('T')[0],
        price: Math.round(basePrice * (0.8 + Math.random() * 0.4)),
        day: getDayName(currentDate.getDay()),
        fullDate: currentDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    setPriceHistoryData(fallbackData);
  };

  const chartData = {
    labels: priceHistoryData.map((item) => item.day),
    datasets: [
      {
        label: "Flight Price (₹)",
        data: priceHistoryData.map((item) => item.price),
        borderColor: "rgb(0, 0, 0)",
        backgroundColor:
          chartType === "line"
            ? "rgba(0, 0, 0, 0.1)"
            : "rgba(0, 0, 0, 0.7)",
        tension: 0.1,
        fill: chartType === "line",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
        }
      },
      title: {
        display: true,
        text: "7-Day Price Forecast",
        color: "black",
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "black",
        bodyColor: "black",
        borderColor: "black",
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const dataPoint = priceHistoryData[context.dataIndex];
            return `₹${dataPoint.price.toLocaleString('en-IN')} - ${dataPoint.fullDate}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Price (₹)",
          color: "black",
        },
        ticks: {
          color: "black",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        }
      },
      x: {
        title: {
          display: true,
          text: "Day",
          color: "black",
        },
        ticks: {
          color: "black",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-black selection:text-white">
  <div className="container mx-auto p-4 md:p-8 max-w-7xl">
    
    <div className="text-center mb-12 pt-6">
      <div className="inline-flex items-center justify-center mb-6 relative group">
        <div className="absolute inset-0 bg-gray-200 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="relative bg-black p-4 rounded-full mr-4 shadow-xl shadow-gray-400/20">
          <FaPlane className="text-3xl text-white transform -rotate-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black">
          Flight Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">Predictor</span>
        </h1>
      </div>
      <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
        Advanced AI-powered flight price predictions leveraging historical data analysis for smarter travel.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <div className="lg:col-span-8 space-y-8">
        
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
              <span className="bg-gray-100 p-2 rounded-lg mr-3">
                <FaPlane className="text-gray-800 text-lg" />
              </span>
              Flight Parameters
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Airline</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPlane className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="airline"
                      name="airline"
                      value={formData.airline}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Airline</option>
                      <option value="AirAsia">AirAsia</option>
                      <option value="Indigo">Indigo</option>
                      <option value="GO_FIRST">GO FIRST</option>
                      <option value="SpiceJet">SpiceJet</option>
                      <option value="Air_India">Air India</option>
                      <option value="Vistara">Vistara</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Departure Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                      type="date"
                      id="departure_date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">From</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCity className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="source_city"
                      name="source_city"
                      value={formData.source_city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">To</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="destination_city"
                      name="destination_city"
                      value={formData.destination_city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Destination</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={swapCities}
                    title="Swap cities"
                    className="absolute right-0 md:-left-8 md:right-auto md:top-[42px] top-8 z-10 bg-white border border-gray-200 shadow-md p-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 transform hover:rotate-180 active:scale-90"
                  >
                    <FaExchangeAlt className="text-xs md:text-sm" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Departure Time</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="departure_time"
                      name="departure_time"
                      value={formData.departure_time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="Early_Morning">Early Morning (12AM-6AM)</option>
                      <option value="Morning">Morning (6AM-12PM)</option>
                      <option value="Afternoon">Afternoon (12PM-6PM)</option>
                      <option value="Evening">Evening (6PM-12AM)</option>
                      <option value="Night">Night (10PM-12AM)</option>
                      <option value="Late_Night">Late Night (10PM-12AM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Arrival Time</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="arrival_time"
                      name="arrival_time"
                      value={formData.arrival_time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="Early_Morning">Early Morning (12AM-6AM)</option>
                      <option value="Morning">Morning (6AM-12PM)</option>
                      <option value="Afternoon">Afternoon (12PM-6PM)</option>
                      <option value="Evening">Evening (6PM-12AM)</option>
                      <option value="Night">Night (10PM-12AM)</option>
                      <option value="Late_Night">Late Night (10PM-12AM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Stops</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPlane className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="stops"
                      name="stops"
                      value={formData.stops}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Stops</option>
                      <option value="zero">Non-stop</option>
                      <option value="one">1 Stop</option>
                      <option value="two_or_more">2+ Stops</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Class</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChair className="text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Class</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 active:scale-[0.99] focus:ring-4 focus:ring-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3 text-lg" /> 
                      <span>Processing AI Model...</span>
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="mr-3 text-lg group-hover:scale-110 transition-transform" /> 
                      <span>Get Price Estimate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-6 md:p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-black flex items-center mb-4 md:mb-0">
              <span className="bg-gray-100 p-2 rounded-lg mr-3">
                 <FaChartLine className="text-gray-800" />
              </span>
              7-Day Forecast
            </h3>
            
            <div className="flex items-center space-x-4 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              {chartLoading && (
                <div className="flex items-center text-xs text-gray-500 px-2">
                  <FaSpinner className="animate-spin mr-1.5" /> Loading...
                </div>
              )}
              <div className="flex space-x-1">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chartType === "line"
                      ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType("histogram")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chartType === "histogram"
                      ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[300px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col justify-center">
            {formData.departure_date ? (
              <>
                {priceHistoryData.length > 0 ? (
                  <div className="h-72 w-full">
                    {chartType === "line" ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Bar data={chartData} options={chartOptions} />
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <FaChartLine className="text-4xl mx-auto mb-2 opacity-20" />
                    <p>{chartLoading ? "Fetching data..." : "No historical data found for this route."}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400">
                <FaCalendarAlt className="text-4xl mx-auto mb-2 opacity-20" />
                <p>Select a date to view price trends</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        {prediction && (
          <div className="bg-gray-900 text-white rounded-3xl shadow-xl shadow-gray-400/30 p-8 border border-gray-800 transform transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-800 rounded-full blur-2xl opacity-50"></div>
            <h2 className="text-lg font-medium text-gray-300 mb-6 flex items-center border-b border-gray-700 pb-3">
              <FaMoneyBillWave className="mr-3" />
              Estimated Price
            </h2>
            <div className="text-center relative z-10">
              <p className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                ₹{prediction.prediction?.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-400 text-sm uppercase tracking-widest mt-2">
                One way per person
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-lg font-bold text-black flex items-center">
              <FaHistory className="mr-2 text-gray-600" />
              Recent Searches
            </h3>
            {predictionHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-red-500 hover:text-red-700 text-xs font-semibold uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors flex items-center"
              >
                <FaTrash className="mr-1.5" /> Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {predictionHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <FaHistory className="text-3xl mb-2" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              predictionHistory.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-black/10 hover:bg-white hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-black flex items-center gap-2">
                        {item.details.source_city} <FaPlane className="text-xs text-gray-400 transform rotate-90" /> {item.details.destination_city}
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-2">
                        <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] font-medium">{item.details.airline}</span>
                      </div>
                    </div>
                    <div className="font-bold text-black text-lg group-hover:text-green-600 transition-colors">
                      ₹{item.prediction?.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowTips(!showTips)}>
            <h3 className="text-lg font-bold text-black flex items-center">
              <FaInfoCircle className="mr-2 text-gray-600" />
              Smart Travel Tips
            </h3>
            <button className="text-gray-400 hover:text-black transition-colors">
              {showTips ? "−" : "+"}
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showTips ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <ul className="space-y-3">
                {[
                  "Book 6-8 weeks in advance",
                  "Mid-week flights (Tue/Wed) are cheaper",
                  "Early morning flights save money",
                  "Be flexible with dates (+/- 3 days)",
                  "Set alerts for price drops"
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default App;