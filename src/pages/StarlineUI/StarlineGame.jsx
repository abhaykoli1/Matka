import React, { useState, useEffect } from "react";
import axios from "axios";
import { Play } from "lucide-react";
import { API_URL } from "../../config";

const API_BASE = `${API_URL}/starline_jackpot`;

const starlineRates = [
  { label: "Single Digit", rate: "10 - 100" },
  { label: "Single Panna", rate: "10 - 1600" },
  { label: "Double Panna", rate: "10 - 3200" },
  { label: "Triple Panna", rate: "10 - 7000" },
];

export default function StarlineGame() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(marketData);

  // Fetch markets
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/starline/list`);
      setMarketData(res.data);
    } catch (err) {
      setError("Failed to load markets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // Rate row UI
  const RateRow = ({ label, rate }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <p className="text-gray-200 font-medium">{label}</p>
      <p className="text-gray-200 font-bold">{rate}</p>
    </div>
  );

  // Market card UI
  const MarketCard = ({ market }) => (
    <div className="flex items-center justify-between bg-white/20 rounded-xl shadow-md p-4 mb-3">
      {/* LEFT CONTENT */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-200 uppercase tracking-wider">
          {market.name}
        </h3>

        <p
          className={`${
            market.status === "Market Running"
              ? "text-green-500"
              : "text-red-400"
          } text-sm font-semibold mt-1`}
        >
          {market.status}
        </p>

        <p className="text-gray-200 text-sm mt-1">
          Start: <span className="font-bold">{market.start_time}</span>
        </p>

        <p className="text-gray-200 text-sm">
          End: <span className="font-bold">{market.end_time}</span>
        </p>
      </div>

      {/* PLAY BUTTON */}
      <a
        href={
          market.status === "Market Running"
            ? `/starline/${market.id}`
            : undefined
        }
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition 
    ${
      market.status === "Market Running"
        ? "bg-green-500 hover:bg-green-600"
        : "bg-gray-600 pointer-events-none opacity-50"
    }
  `}
      >
        <Play size={20} color="white" fill="white" />
      </a>
    </div>
  );

  return (
    <div className="max-w-md mx-auto font-sans pb-12">
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center">
        <h1 className="text-xl font-semibold">STARLINE GAME</h1>
      </div>

      {/* RATE CARD */}
      <div className="p-3">
        <div className="bg-white/20 rounded-xl shadow-xl p-3 space-y-1 mb-4">
          {starlineRates.map((item, index) => (
            <RateRow key={index} label={item.label} rate={item.rate} />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="/starline-bid-history"
            className="bg-gradient-to-bl flex items-center justify-center from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg"
          >
            Bid History
          </a>
          <a
            href="/starline-win-history"
            className="bg-gradient-to-bl flex items-center justify-center from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg"
          >
            Win History
          </a>
        </div>

        {/* MARKET CARDS */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-300 text-center py-6">Loading markets...</p>
          ) : error ? (
            <p className="text-red-400 text-center py-6">{error}</p>
          ) : marketData.length === 0 ? (
            <p className="text-gray-400 text-center py-6">
              No Starline markets available.
            </p>
          ) : (
            marketData.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
