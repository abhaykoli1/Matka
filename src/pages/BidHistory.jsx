// src/pages/BidHistory.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { ArrowLeft, Loader } from "lucide-react";

const API_BASE = `${API_URL}`;

export default function BidHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const token = localStorage.getItem("accessToken");

  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // Fetch History
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API_BASE}/bid/my-bids`, {
        headers: authHeader,
      });

      setHistory(Array.isArray(res.data) ? res.data : res.data.history || []);
    } catch (err) {
      console.warn(
        "Failed to fetch history:",
        err?.response?.data || err.message
      );
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="max-w-md mx-auto pb-20  text-white font-sans min-h-screen">
      <div className="w-full mb-2 relative bg-gradient-to-b from-black to-black/0 py-2 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="p-2 pl-4 z-10 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-md z-0 w-full absolute   justify-between font-bold bg-gradient-to-b from-black to-black/0 px-4 py-2  flex justify-center items-center gap-2">
          <span className="flex gap-2 text-md items-center uppercase">
            Bid History
          </span>
        </h2>
        <a className="pr-4 z-10"></a>
      </div>

      {loadingHistory ? (
        <div className="text-center text-gray-400">
          <Loader className="animate-spin inline-block text-center" />{" "}
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-center">No bids found.</div>
      ) : (
        <div className="space-y-3 ">
          {history.map((h) => (
            <div
              key={h.id}
              className="bg-white/5 p-3 mx-3 mt-1  rounded-lg border border-gray-50/10"
            >
              <p className="text-sm font-semibold">
                {(h.game_type || "").replace(/_/g, " ")} — {h.session}
              </p>

              <p className="text-gray-300">Digit: {h.digit}</p>
              <p className="text-gray-300">Points: {h.points}</p>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(h.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
