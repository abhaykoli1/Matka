import { CardSim, Coins, Diamond, Dice1, Dice2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/market`;

export default function Games() {
  const { marketId } = useParams();

  // --- STATE FOR MARKET ---
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert name → slug
  const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

  // ============================
  // FETCH MARKET DETAILS
  // ============================
  const fetchMarketDetails = useCallback(async () => {
    if (!marketId) {
      setError("Market ID missing");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.get(`${API_BASE}/${marketId}`);

      setMarket(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load market details.");
    } finally {
      setIsLoading(false);
    }
  }, [marketId]);

  useEffect(() => {
    fetchMarketDetails();
  }, [fetchMarketDetails]);

  // ============================
  // GAME CARDS
  // ============================
  const allGames = [
    {
      name: "Single Digit",
      icon: <Dice1 size={30} className="text-yellow-500" />,
    },
    {
      name: "Jodi Digit",
      icon: <Dice2 size={30} className="text-yellow-500" />,
    },
    {
      name: "Single Panna",
      icon: <CardSim size={30} className="text-yellow-500" />,
    },
    {
      name: "Double Panna",
      icon: <CardSim size={30} className="text-yellow-500" />,
    },
    {
      name: "Triple Panna",
      icon: <Diamond size={30} className="text-yellow-500" />,
    },
    {
      name: "SP, DP ,TP",
      icon: <Coins size={30} className="text-yellow-500" />,
    },
    {
      name: "Half Sangam",
      icon: (
        <img
          src="https://placehold.co/60x60/fde047/1f2937?text=H"
          alt=""
          className="w-14 h-14 object-contain"
        />
      ),
    },
    {
      name: "Full Sangam",
      icon: (
        <img
          src="https://placehold.co/60x60/fde047/1f2937?text=F"
          alt=""
          className="w-14 h-14 object-contain"
        />
      ),
    },
  ];

  // ============================
  // LOADING
  // ============================
  if (isLoading) {
    return (
      <div className="text-white text-center py-10 max-w-md mx-auto min-h-screen">
        <h1 className="text-xl font-semibold animate-pulse">
          Loading Market...
        </h1>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================
  if (error) {
    return (
      <div className="text-center py-10 max-w-md mx-auto min-h-screen bg-red-800/30 text-red-300 p-4">
        <h1 className="text-xl font-semibold mb-2">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="text-white text-center py-10 max-w-md mx-auto min-h-screen">
        <h1 className="text-xl font-semibold">Market Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col font-sans text-white">
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 py-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold uppercase tracking-widest">
          {market.name}
        </h1>
      </div>

      {/* MARKET DETAILS */}
      <div className="bg-[#5a0572] text-xs py-2 px-4 flex justify-around text-gray-300 mb-4 border-b-2 border-[#5a0572]">
        <p>
          Open:{" "}
          <span className="text-white font-medium">{market.open_time}</span>
        </p>

        <p>
          Close:{" "}
          <span className="text-white font-medium">{market.close_time}</span>
        </p>

        <span
          className={`font-bold py-0.5 px-2 rounded-full text-xs ${
            market.status === "Market Running" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {market.status === "Market Running" ? "LIVE" : "CLOSED"}
        </span>
      </div>

      {/* GAME GRID */}
      <div className="grid grid-cols-2 gap-4 p-3 pb-20">
        {allGames.map((game, index) => (
          <a
            key={index}
            href={`/game/${marketId}/${createSlug(game.name)}`}
            className="flex flex-col justify-center items-center bg-gray-800/80 rounded-xl py-6 shadow-2xl hover:bg-cyan-700/50 transition-all duration-200 hover:scale-[1.03] border border-gray-700 hover:border-cyan-500"
          >
            <div className="bg-[#5a0572] rounded-full p-4 mb-3 shadow-lg shadow-[#5a0572]/50">
              {game.icon}
            </div>
            <p className="text-gray-100 text-sm font-bold text-center tracking-wider">
              {game.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
