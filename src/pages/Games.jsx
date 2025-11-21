import { ArrowLeft, CardSim, Coins, Diamond, Dice1, Dice2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMarketById } from "./Admin/Market/marketapi";
// FIXED: Changed path from "./Admin/Market/marketapi" to "./marketapi"
// assuming the helper file is in the same directory or accessible at the root level.

export default function Games() {
  const { marketId } = useParams();

  // --- STATE FOR MARKET DETAILS ---
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to create a URL-friendly slug from the game name
  const createSlug = (name) => {
    // Ensuring the slug is URL-safe for use as a path parameter
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Function to fetch market data
  const fetchMarketDetails = useCallback(async () => {
    if (!marketId) {
      setError("Market ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getMarketById(marketId);
      setMarket(data);
    } catch (err) {
      console.error("Fetch market details error:", err);
      setError(
        "Failed to load market details. Please check your API connection."
      );
    } finally {
      setIsLoading(false);
    }
  }, [marketId]);

  useEffect(() => {
    fetchMarketDetails();
  }, [fetchMarketDetails]);

  // --- Game Definitions ---
  // Combine all games into a single array for easier mapping
  const allGames = [
    {
      name: "Single Digit",
      icon: <Dice1 size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "Jodi Digit",
      icon: <Dice2 size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "Single Panna",
      icon: <CardSim size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "Double Panna",
      icon: <CardSim size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "Triple Panna",
      icon: <Diamond size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "SP, DP ,TP",
      icon: <Coins size={30} className="text-yellow-500" />,
      type: "regular",
    },
    {
      name: "Half Sangam",
      icon: (
        <img
          src="https://placehold.co/60x60/fde047/1f2937?text=H" // Placeholder using the icon's color
          alt="Half Sangam"
          className="w-14 h-14 object-contain"
        />
      ),
      type: "sangam",
    },
    {
      name: "Full Sangam",
      icon: (
        <img
          src="https://placehold.co/60x60/fde047/1f2937?text=F" // Placeholder using the icon's color
          alt="Full Sangam"
          className="w-14 h-14 object-contain"
        />
      ),
      type: "sangam",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-white text-center py-10 max-w-md mx-auto min-h-screen bg-gray-900">
        <h1 className="text-xl font-semibold animate-pulse">
          Loading Market...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 max-w-md mx-auto min-h-screen bg-red-900/50 text-red-300 p-4">
        <h1 className="text-xl font-semibold mb-2">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="text-white text-center py-10 max-w-md mx-auto min-h-screen bg-gray-900">
        <h1 className="text-xl font-semibold">Market Not Found.</h1>
      </div>
    );
  }

  return (
    <div className=" max-w-md mx-auto flex flex-col font-sans  ">
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative ">
        <h1 className="text-lg font-semibold uppercase tracking-widest text-[#fff]">
          {market.name}
        </h1>
      </div>

      <div className="bg-gradient-tot from bg-[#5a0572] to-black/0 text-xs py-2 px-4 flex justify-around text-gray-300  mb-4 border-b-2 border-[#5a0572]">
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
            market.is_active
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {market.is_active ? "LIVE" : "CLOSED"}
        </span>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-4 p-3 pb-20">
        {allGames.map((game, index) => (
          <a
            key={`game-${index}`}
            href={`/game/${marketId}/${createSlug(game.name)}`}
            className="flex flex-col justify-center items-center bg-gray-800/80 rounded-xl py-6 shadow-2xl hover:bg-cyan-700/50 cursor-pointer transition-all duration-200 hover:scale-[1.03] border border-gray-700 hover:border-cyan-500"
          >
            <div className="bg-[#5a0572] rounded-full p-4 mb-3 shadow-lg shadow-[#5a0572]/50">
              {game.icon}
            </div>
            <p className="text-gray-100 text-sm font-bold text-center mt-1 tracking-wider">
              {game.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
