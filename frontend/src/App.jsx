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
    <div className="min-h-screen bg-white text-black text-l">
           <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-black p-3 rounded-full mr-3 shadow-md">
              <FaPlane className="text-2xl text-white transform -rotate-90" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Flight Price Predictor
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Advanced AI-powered flight price predictions with historical data
            analysis
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold text-black mb-6 flex items-center border-b border-dashed border-gray-400 pb-2">
                <FaPlane className="mr-3 text-black" />
                Flight Details
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  {/* Airline */}
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaPlane className="mr-2 text-black" /> Airline
                    </label>
                    <select
                      id="airline"
                      name="airline"
                      value={formData.airline}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
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

                  {/* Source City */}
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaCity className="mr-2 text-black" /> Source City
                    </label>
                    <select
                      id="source_city"
                      name="source_city"
                      value={formData.source_city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Source City</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>

                  {/* Destination City */}
                  <div className="relative">
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaMapMarkerAlt className="mr-2 text-black" /> Destination City
                    </label>
                    <select
                      id="destination_city"
                      name="destination_city"
                      value={formData.destination_city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Destination City</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                    <button
                      type="button"
                      onClick={swapCities}
                      title="Swap cities"
                      className="absolute right-2 top-9 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FaExchangeAlt className="text-black" />
                    </button>
                  </div>

                  {/* Time & Class */}
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaClock className="mr-2 text-black" /> Departure Time
                    </label>
                    <select
                      id="departure_time"
                      name="departure_time"
                      value={formData.departure_time}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Departure Time</option>
                      <option value="Early_Morning">Early Morning (12AM-6AM)</option>
                      <option value="Morning">Morning (6AM-12PM)</option>
                      <option value="Afternoon">Afternoon (12PM-6PM)</option>
                      <option value="Evening">Evening (6PM-12AM)</option>
                      <option value="Night">Night (10PM-12AM)</option>
                      <option value="Late_Night">Late Night (10PM-12AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaClock className="mr-2 text-black" /> Arrival Time
                    </label>
                    <select
                      id="arrival_time"
                      name="arrival_time"
                      value={formData.arrival_time}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Arrival Time</option>
                      <option value="Early_Morning">Early Morning (12AM-6AM)</option>
                      <option value="Morning">Morning (6AM-12PM)</option>
                      <option value="Afternoon">Afternoon (12PM-6PM)</option>
                      <option value="Evening">Evening (6PM-12AM)</option>
                      <option value="Night">Night (10PM-12AM)</option>
                      <option value="Late_Night">Late Night (10PM-12AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaPlane className="mr-2 text-black" /> Number of Stops
                    </label>
                    <select
                      id="stops"
                      name="stops"
                      value={formData.stops}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Number of Stops</option>
                      <option value="zero">Non-stop</option>
                      <option value="one">1 Stop</option>
                      <option value="two_or_more">2+ Stops</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaChair className="mr-2 text-black" /> Class
                    </label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    >
                      <option value="">Select Class</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center text-gray-800">
                      <FaCalendarAlt className="mr-2 text-black" /> Departure Date
                    </label>
                    <input
                      type="date"
                      id="departure_date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-black"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Predicting...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave className="mr-2" /> Predict Flight Price
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Prediction Result */}
            {prediction && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
                <h2 className="text-2xl font-semibold text-black mb-4 flex items-center border-b border-dashed border-gray-400 pb-2">
                  <FaMoneyBillWave className="mr-2 text-black" />
                  Prediction Result
                </h2>
                <div className="text-center p-6 bg-gray-100 rounded-xl border border-gray-300">
                  <p className="text-4xl font-bold text-black mb-2">
                    ₹{prediction.prediction?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-gray-700">Estimated Flight Price</p>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <FaChartLine className="mr-2 text-black" />
                  7-Day Price Forecast
                </h3>
                <div className="flex items-center space-x-2">
                  {chartLoading && (
                    <div className="flex items-center text-sm text-gray-700">
                      <FaSpinner className="animate-spin mr-1" /> Loading...
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-3 py-1 rounded text-sm ${
                        chartType === "line"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType("histogram")}
                      className={`px-3 py-1 rounded text-sm ${
                        chartType === "histogram"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
              </div>

              {formData.departure_date ? (
                <div className="h-64">
                  {priceHistoryData.length > 0 ? (
                    chartType === "line" ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Bar data={chartData} options={chartOptions} />
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-700">
                      {chartLoading ? "Loading chart data..." : "No data available"}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-700 bg-gray-100 rounded-lg">
                  Select a departure date to see price forecast
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* History */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <FaHistory className="mr-2 text-black" />
                  Prediction History
                </h3>
                {predictionHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    title="Clear history"
                  >
                    <FaTrash className="mr-1" /> Clear
                  </button>
                )}
              </div>

              {predictionHistory.length === 0 ? (
                <p className="text-gray-700 text-center py-4">
                  No prediction history yet
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {predictionHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-100 rounded-lg border border-gray-300 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-black">
                            {item.details.source_city} →{" "}
                            {item.details.destination_city}
                          </div>
                          <div className="text-xs text-gray-700 mt-1">
                            {new Date(item.timestamp).toLocaleDateString()} •{" "}
                            {item.details.airline}
                          </div>
                        </div>
                        <div className="font-bold text-black text-right">
                          ₹{item.prediction?.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black flex items-center">
                  <FaInfoCircle className="mr-2 text-black" />
                  Booking Tips
                </h3>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                >
                  {showTips ? "Hide Tips" : "Show Tips"}
                </button>
              </div>

              {showTips && (
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <h4 className="font-semibold text-black mb-2">
                    Best Booking Practices
                  </h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Book 6-8 weeks in advance for best prices</li>
                    <li>Tuesday and Wednesday flights are often cheaper</li>
                    <li>Early morning flights tend to be less expensive</li>
                    <li>Be flexible with dates for additional savings</li>
                    <li>Set price alerts for your preferred routes</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;