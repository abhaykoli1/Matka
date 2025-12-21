// src/pages/WinHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader } from "lucide-react";
import { API_URL } from "../../config";

export default function GWinHistory() {
  const [loading, setLoading] = useState(true);
  const [wins, setWins] = useState([]);

  const token = localStorage.getItem("accessToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  // Cache for marketName
  const marketCache = {};

  // Fetch Market Name
  const getMarketName = async (marketId) => {
    if (marketCache[marketId]) return marketCache[marketId];

    try {
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/market/${marketId}`,
        { headers }
      );

      const name = res.data?.data?.name || "Unknown Market";
      marketCache[marketId] = name;
      return name;
    } catch {
      return "Unknown Market";
    }
  };

  // Fetch Win History
  const loadWinHistory = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/win-history`,
        { headers }
      );

      console.log(res);

      const list = res.data?.data || [];

      // Attach market names
      const finalList = await Promise.all(
        list.map(async (w) => ({
          ...w,
          market_name: await getMarketName(w.market_id),
        }))
      );

      setWins(finalList);
    } catch (err) {
      console.error("Error fetching win history:", err);
      setWins([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadWinHistory();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen text-white flex justify-center items-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="max-w-md mx-auto text-white pb-20">
      {/* HEADER */}
      <div className="w-full relative bg-gradient-to-b from-black to-black/0 py-2 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="p-2 pl-4 z-10 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h2 className="text-md z-0 w-full absolute font-bold px-4 py-2 flex justify-center items-center gap-2">
          <span className="uppercase">Golidesawar Win History</span>
        </h2>

        <div className="pr-4 z-10"></div>
      </div>

      {/* WIN LIST */}
      <div className="p-3">
        {wins.length === 0 && (
          <p className="text-gray-400 text-sm">No wins found yet.</p>
        )}

        {wins.map((w, i) => (
          <div
            key={i}
            className="p-3 bg-black/20 border border-gray-50/5 rounded-lg mb-3"
          >
            {/* MARKET NAME */}
            <p className="text-sm">
              <span className="text-gray-200 uppercase">Market:</span>{" "}
              {w.market_name}
            </p>

            {/* GAME TYPE */}
            <p className="text-sm">
              <span className="text-gray-200">Game: </span>
              {w.game_type}
            </p>

            {/* DIGIT DISPLAY */}
            <p className="text-sm">
              <span className="text-gray-200">
                {w.game_type === "jodi"
                  ? "Jodi"
                  : w.session === "open"
                  ? "Open Digit"
                  : "Close Digit"}
                :{" "}
              </span>

              {w.game_type === "jodi"
                ? `${w.open_digit}${w.close_digit}`
                : w.session === "open"
                ? w.open_digit
                : w.close_digit}
            </p>

            {/* POINTS */}
            <p className="text-sm">
              <span className="text-gray-200">Points Played:</span> {w.points}
            </p>

            {/* WIN AMOUNT */}
            <p className="text-sm text-green-400 font-semibold">
              <span className="text-gray-200">Win Amount:</span> ₹{w.win_amount}
            </p>

            {/* RESULT DIGITS */}
            <p className="text-xs mt-1 text-gray-400">
              Result: {w.result_open} - {w.result_close}
            </p>

            {/* TIME */}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(
                new Date(w.created_at).getTime() + 5.5 * 60 * 60 * 1000
              ).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              {/* {new Date(
                new Date(w.date).getTime() + 5.5 * 60 * 60 * 1000
              ).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })} */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
