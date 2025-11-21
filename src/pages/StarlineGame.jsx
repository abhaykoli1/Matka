import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, BarChart2, Play } from "lucide-react";
import { API_URL } from "../config";

// --- API Configuration (Adjust this URL to match your backend) ---
const API_BASE = `${API_URL}/starline_jackpot`;

// Mock data structures for Starline Game (kept for structure reference, but will be replaced by API data)
const starlineRates = [
  { label: "Single Digit", rate: "10 - 100" },
  { label: "Single Panna", rate: "10 - 1600" },
  { label: "Double Panna", rate: "10 - 3200" },
  { label: "Triple Panna", rate: "10 - 7000" },
];

const StarlineGame = () => {
  // --- Dynamic State Management ---
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(marketData);
  // 1. Fetch Slots (GET /starline/list)
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/starline/list`);

      // Map the backend data structure to a format suitable for the MarketCard
      const formattedData = response.data.map((slot) => ({
        id: slot.id, // Use actual ID for keys
        time: slot.name || slot.start_time, // Use slot name or start_time for display
        result: "XXX-X", // Placeholder for result until a separate API provides it
        status: "Market Running", // Placeholder for status
        start_time: slot.start_time,
      }));

      setMarketData(formattedData);
    } catch (err) {
      console.error("Error fetching Starline markets:", err);
      setError(
        "Failed to load Starline markets. Please check the server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch function on component mount
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Component for a single rate row
  const RateRow = ({ label, rate }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-gray-200 font-medium">{label}</p>
      <p className="text-gray-200 font-bold">{rate}</p>
    </div>
  );

  // Component for a single market card
  // Note: market now contains the properties from the mapped API data
  const MarketCard = ({ market }) => (
    <div className="flex items-center justify-between bg-white/20 rounded-xl shadow-md p-4 mb-3">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-200 uppercase tracking-wider">
          {market.time}
        </h3>
        <p className="text-2xl font-extrabold text-[#e1abf0] mt-1">
          {market.result}
        </p>
        <p className="text-[#e1abf0] font-semibold text-sm mt-1">
          {market.status}
        </p>
        <p className="text-gray-200 text-xs">Closing: {market.start_time}</p>
      </div>

      {/* Play Button */}
      <button
        className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition duration-150"
        onClick={() =>
          console.log(`Playing Starline at: ${market.time} (ID: ${market.id})`)
        }
        aria-label={`Play Starline at ${market.time}`}
      >
        <a href={`/starline/${market.id}`}>
          <Play size={20} color="white" fill="white" />
        </a>
      </button>
    </div>
  );

  return (
    // Main container
    <div className="max-w-md mx-auto font-sans pb-13">
      {/* 1. Header Section */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative">
        <h1 className="text-xl font-semibold text-white tracking-wide">
          STARLINE GAME
        </h1>
        <button
          className="absolute right-4 p-1 rounded-full hover:bg-purple-800 transition"
          onClick={() => console.log("Chart button clicked")}
          aria-label="View charts"
        >
          <BarChart2 size={24} color="white" />
        </button>
      </div>

      {/* 2. Content Card Container */}
      <div className="p-3">
        {/* 3. White Rate Card */}
        <div className="bg-white/20 rounded-xl shadow-xl p-4 space-y-3 mb-4">
          <div className="space-y-2">
            {starlineRates.map((item, index) => (
              <RateRow key={index} label={item.label} rate={item.rate} />
            ))}
          </div>
        </div>

        {/* 4. History Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-gradient-to-bl from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-purple-800 transition transform hover:scale-[1.01]">
            Bid History
          </button>
          <button className="bg-gradient-to-bl from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-purple-800 transition transform hover:scale-[1.01]">
            Win History
          </button>
        </div>

        {/* 5. Dynamic Starline Market Cards */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-300 py-6">
              <p>Loading markets...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-6 p-3 bg-red-900/50 rounded-lg">
              <p>{error}</p>
            </div>
          ) : marketData.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              <p>No Starline markets are currently available.</p>
            </div>
          ) : (
            marketData.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StarlineGame;
