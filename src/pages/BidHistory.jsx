// src/pages/BidHistory.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Loader } from "lucide-react";

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
    <div className="max-w-md mx-auto  text-white font-sans min-h-screen">
      <div className="w-full bg-gradient-to-b from-black to-black/0 py-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold uppercase tracking-widest">
          Bid History
        </h1>
      </div>

      {loadingHistory ? (
        <div className="text-center text-gray-400">
          <Loader className="animate-spin inline-block text-center" />{" "}
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-center">No bids found.</div>
      ) : (
        <div className="space-y-3 pb-15">
          {history.map((h) => (
            <div
              key={h.id}
              className="bg-white/10 p-3 mx-3 mt-1  rounded-lg border border-gray-700"
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
