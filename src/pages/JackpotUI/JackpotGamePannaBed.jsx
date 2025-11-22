import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const API_BASE = `${API_URL}/starline_jackpot`;

export default function JackpotGamePannaBed() {
  const { marketId, gameId } = useParams();

  const [market, setMarket] = useState(null);
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  // AUTH
  const token = localStorage.getItem("accessToken");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // FORMAT GAME NAME
  const formatGameName = (str = "") =>
    str.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const gameName = formatGameName(gameId);
  const apiGameName = gameId.replace(/-/g, "_");

  // LIMIT INPUT
  const handleDigitChange = (value) => {
    const clean = value.replace(/\D/g, "");

    if (apiGameName === "single_digit") {
      if (clean.length <= 1) setDigit(clean);
    } else {
      if (clean.length <= 3) setDigit(clean);
    }
  };

  // FETCH MARKET DETAILS
  const fetchMarket = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/jackpot/${marketId}`,
        authHeader
      );
      setMarket(res.data);
    } catch (err) {
      console.error("Failed to load market", err);
    }
  };

  // FETCH RESULT
  const fetchResult = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jackpot/result/get`, {
        params: { slot_id: marketId },
        ...authHeader,
      });
      setResult(res.data);
    } catch (err) {
      console.log("Failed to load result", err);
    }
  };

  // FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/jackpot/bid/history`,
        authHeader
      );
      const list = Array.isArray(res.data) ? res.data : res.data.history || [];
      setHistory(list);
    } catch (err) {
      console.log("Failed to load history", err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMarket();
      await fetchResult();
      await fetchHistory();
      setLoading(false);
    })();
  }, [marketId]);

  // SUBMIT BID
  const placeBid = async () => {
    setMessage("");

    if (!digit || !points) {
      setMessage("Please enter digit and points.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/jackpot/bid`,
        {},
        {
          params: {
            slot_id: marketId,
            game_type: apiGameName,
            digit,
            points: Number(points),
          },
          ...authHeader,
        }
      );

      setMessage(res.data.msg);
      setDigit("");
      setPoints("");
      fetchHistory();
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.detail || "Error placing bid");
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="text-white min-h-screen flex justify-center items-center bg-black">
        <h1 className="text-xl animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-white min-h-screen pb-24">
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center">
        <h1 className="text-xl font-semibold tracking-wide">
          {market.name.toUpperCase()} - {gameName}
        </h1>
      </div>

      {/* MARKET INFO */}
      <div className="p-4 flex items-center justify-between border-b border-purple-900 text-sm">
        <p>
          <span className="text-gray-300">Open:</span> {market.start_time}
        </p>
        <p>
          <span className="text-gray-300">Close:</span> {market.end_time}
        </p>

        <p className="text-center">
          Status:
          <span
            className={`px-2 py-0.5 rounded-lg font-bold ml-1 ${
              market.status === "Market Running"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {market.status === "Market Running" ? "LIVE" : "CLOSED"}
          </span>
        </p>
      </div>

      {/* RESULT BOX */}
      <div className="p-4 border-b border-purple-900">
        <h2 className="font-bold text-purple-300">Latest Result</h2>
        {result?.panna ? (
          <div className="text-center mt-2">
            <p className="text-xl font-bold text-yellow-400">{result.panna}</p>
            <p className="text-sm text-gray-400">{result.date}</p>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No result yet</p>
        )}
      </div>

      {/* BID FORM */}
      <div className="p-4">
        <h2 className="text-md font-bold mb-3">Place Your Bid</h2>

        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter Digit / Panna"
          value={digit}
          disabled={market.status !== "Market Running"}
          onChange={(e) => handleDigitChange(e.target.value)}
          className="w-full p-2.5 rounded-lg border text-white mb-3 outline-none"
          maxLength={apiGameName === "single_digit" ? 1 : 3}
        />

        <input
          type="number"
          placeholder="Enter Points"
          value={points}
          disabled={market.status !== "Market Running"}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full p-2.5 rounded-lg border text-white mb-3 outline-none"
        />

        <button
          disabled={market.status !== "Market Running"}
          onClick={placeBid}
          className={`w-full bg-gradient-to-bl from-[#212b61] to-[#79049a] text-white py-3 rounded-lg font-bold 
            ${
              market.status !== "Market Running"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          Submit Bid
        </button>

        {message && (
          <p className="text-center text-red-400 font-semibold mt-3">
            {message}
          </p>
        )}
      </div>

      {/* BID HISTORY */}
      <div className="p-4 border-t border-purple-900 mt-4">
        <h2 className="text-lg font-bold mb-3">Your Bid History</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No bidding history found.</p>
        ) : (
          <div className="space-y-3">
            {history.map((b, i) => (
              <div
                key={i}
                className="bg-white/20 p-3 border border-gray-700 rounded-lg"
              >
                <p className="text-sm">
                  <span className="text-gray-300">Game: </span>
                  {formatGameName(b.game)}
                </p>

                <p className="text-sm">
                  <span className="text-gray-300">Digit: </span> {b.digit}
                </p>

                <p className="text-sm">
                  <span className="text-gray-300">Points: </span> {b.points}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(b.time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
