import React, { useState } from "react";
import axios from "axios";
import {
  FaPlane,
  FaCity,
  FaClock,
  FaMapMarkerAlt,
  FaChair,
  FaCalendarAlt,
  FaExchangeAlt,
  FaSearch,
  FaRupeeSign,
  FaSpinner,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { MdFlightTakeoff, MdAirplanemodeActive } from "react-icons/md";
import { AiOutlineCloud } from "react-icons/ai";
import { BsAirplane } from "react-icons/bs";

function FlightPricePredictor() {
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
  const [expandedInfo, setExpandedInfo] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "${process.env.REACT_APP_API_URL}/predict",
        formData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get airline logo based on selection
  const getAirlineLogo = () => {
    const logos = {
      SpiceJet: <FaPlaneDeparture className="text-red-600" />,
      AirAsia: <MdFlightTakeoff className="text-red-500" />,
      Vistara: <FaPlaneArrival className="text-purple-600" />,
      GO_FIRST: <BsAirplane className="text-blue-600" />,
      Indigo: <MdAirplanemodeActive className="text-indigo-600" />,
      Air_India: <AiOutlineCloud className="text-orange-500" />,
    };

    return logos[formData.airline] || "✈️";
  };

  // Get stop information text
  const getStopInfo = () => {
    if (formData.stops === "zero") return "Non-stop flight";
    if (formData.stops === "one") return "1 stop";
    return "2+ stops";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-2">
          <div className="relative">
            <div className="absolute -inset-3 bg-pink-500 rounded-full opacity-70 blur-lg"></div>
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full">
              <FaPlane className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300 ml-4">
            Flight Price Predictor
          </h1>
        </div>
        <p className="text-purple-200 mt-2">
          AI-powered flight price estimation for the best travel deals
        </p>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full lg:w-2/3 space-y-6 border border-white/20 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Airline Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaPlane className="mr-2 text-pink-300" /> Airline
              </label>
              <select
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Airline
                </option>
                <option value="SpiceJet" className="text-gray-800">
                  SpiceJet
                </option>
                <option value="AirAsia" className="text-gray-800">
                  AirAsia
                </option>
                <option value="Vistara" className="text-gray-800">
                  Vistara
                </option>
                <option value="GO_FIRST" className="text-gray-800">
                  GO_FIRST
                </option>
                <option value="Indigo" className="text-gray-800">
                  Indigo
                </option>
                <option value="Air_India" className="text-gray-800">
                  Air India
                </option>
              </select>
            </div>

            {/* Source City Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaCity className="mr-2 text-pink-300" /> Source City
              </label>
              <select
                name="source_city"
                value={formData.source_city}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Source City
                </option>
                <option value="Delhi" className="text-gray-800">
                  Delhi
                </option>
                <option value="Mumbai" className="text-gray-800">
                  Mumbai
                </option>
                <option value="Bangalore" className="text-gray-800">
                  Bangalore
                </option>
                <option value="Kolkata" className="text-gray-800">
                  Kolkata
                </option>
                <option value="Hyderabad" className="text-gray-800">
                  Hyderabad
                </option>
                <option value="Chennai" className="text-gray-800">
                  Chennai
                </option>
              </select>
            </div>

            {/* Departure Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaClock className="mr-2 text-pink-300" /> Departure Time
              </label>
              <select
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Departure Time
                </option>
                <option value="Evening" className="text-gray-800">
                  Evening
                </option>
                <option value="Early_Morning" className="text-gray-800">
                  Early Morning
                </option>
                <option value="Morning" className="text-gray-800">
                  Morning
                </option>
                <option value="Afternoon" className="text-gray-800">
                  Afternoon
                </option>
                <option value="Night" className="text-gray-800">
                  Night
                </option>
                <option value="Late_Night" className="text-gray-800">
                  Late Night
                </option>
              </select>
            </div>

            {/* Stops Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaExchangeAlt className="mr-2 text-pink-300" /> Stops
              </label>
              <select
                name="stops"
                value={formData.stops}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Stops
                </option>
                <option value="zero" className="text-gray-800">
                  Zero
                </option>
                <option value="one" className="text-gray-800">
                  One
                </option>
                <option value="two_or_more" className="text-gray-800">
                  Two or More
                </option>
              </select>
            </div>

            {/* Arrival Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaClock className="mr-2 text-pink-300" /> Arrival Time
              </label>
              <select
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Arrival Time
                </option>
                <option value="Night" className="text-gray-800">
                  Night
                </option>
                <option value="Morning" className="text-gray-800">
                  Morning
                </option>
                <option value="Early_Morning" className="text-gray-800">
                  Early Morning
                </option>
                <option value="Afternoon" className="text-gray-800">
                  Afternoon
                </option>
                <option value="Evening" className="text-gray-800">
                  Evening
                </option>
                <option value="Late_Night" className="text-gray-800">
                  Late Night
                </option>
              </select>
            </div>

            {/* Destination City Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaMapMarkerAlt className="mr-2 text-pink-300" /> Destination
                City
              </label>
              <select
                name="destination_city"
                value={formData.destination_city}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Destination City
                </option>
                <option value="Delhi" className="text-gray-800">
                  Delhi
                </option>
                <option value="Mumbai" className="text-gray-800">
                  Mumbai
                </option>
                <option value="Bangalore" className="text-gray-800">
                  Bangalore
                </option>
                <option value="Kolkata" className="text-gray-800">
                  Kolkata
                </option>
                <option value="Hyderabad" className="text-gray-800">
                  Hyderabad
                </option>
                <option value="Chennai" className="text-gray-800">
                  Chennai
                </option>
              </select>
            </div>

            {/* Class Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaChair className="mr-2 text-pink-300" /> Class
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="text-gray-800">
                  Select Class
                </option>
                <option value="Economy" className="text-gray-800">
                  Economy
                </option>
                <option value="Business" className="text-gray-800">
                  Business
                </option>
              </select>
            </div>

            {/* Departure Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-pink-300" /> Departure Date
              </label>
              <input
                type="date"
                name="departure_date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.departure_date}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/5 border border-white/20 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center disabled:opacity-75 shadow-lg mt-4"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Predicting...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" /> Predict Flight Price
              </>
            )}
          </button>
        </form>

        {/* Results Panel */}
        <div className="w-full lg:w-1/3">
          {prediction !== null ? (
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Flight Estimate
                </h2>
                <p className="text-gray-600">Your predicted flight price</p>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6 border border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-3xl">{getAirlineLogo()}</div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formData.airline}</p>
                    <p className="text-xs text-gray-500">{formData.class}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center my-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{formData.source_city}</p>
                    <p className="text-xs text-gray-500">
                      {formData.departure_time?.replace("_", " ")}
                    </p>
                  </div>

                  <div className="text-center mx-2">
                    <FaArrowRight className="text-pink-500 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1">
                      {getStopInfo()}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {formData.destination_city}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.arrival_time?.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-2">
                  Departure: {formData.departure_date}
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm">Estimated Price</p>
                <div className="text-4xl font-bold text-purple-700 mt-2">
                  <FaRupeeSign className="inline-block mb-1 mr-1" />
                  {prediction.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Inclusive of all taxes and fees
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                <p className="text-yellow-700 text-sm flex items-center justify-center">
                  <FaInfoCircle className="mr-1" /> Prices may vary based on
                  demand
                </p>
              </div>

              <button
                className="w-full mt-4 text-pink-600 text-sm font-medium hover:text-pink-800 transition-colors"
                onClick={() => setExpandedInfo(!expandedInfo)}
              >
                {expandedInfo ? "Hide" : "Show"} booking tips
              </button>

              {expandedInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-sm">
                    <strong>Pro Tip:</strong> Book at least 3 weeks in advance
                    for the best prices. Tuesday and Wednesday flights are often
                    cheaper than weekend flights.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-2xl h-full flex flex-col justify-center">
              <div className="text-white mb-4">
                <FaPlane className="text-4xl mx-auto text-pink-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Flight Price Estimate
              </h3>
              <p className="text-purple-200 mt-2">
                Fill out the form to get an accurate price prediction for your
                flight
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-purple-300 text-sm">
        <p>
          Powered by AI • Results are estimates only • Actual prices may vary
        </p>
      </div>
    </div>
  );
}

export default FlightPricePredictor;
