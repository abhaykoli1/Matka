import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { API_URL } from "../config";

const API_BASE = API_URL;
const getToken = () => localStorage.getItem("accessToken");

export default function WinHistory() {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [wins, setWins] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Win History
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE}/user/winning_history?start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Failed to load data.");
        setWins([]);
      } else {
        setWins(data.wins || []);
      }
    } catch (err) {
      setError("Network error while fetching history.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center font-sans text-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 text-center">
        <h1 className="text-lg font-semibold">Win History</h1>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-[93%] max-w-md bg-white/20 rounded-2xl shadow-lg p-3 mt-3"
      >
        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-200 text-sm mb-1 font-medium">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border text-gray-900 py-2 px-4 rounded-md  border-gray-300 focus:ring-2 focus:ring-purple-700 outline-none"
          />
        </div>

        {/* End Date */}
        <div className="mb-6">
          <label className="block text-gray-200 text-sm mb-1 font-medium">
            To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border text-gray-900 py-2 px-4 rounded-md border-gray-300 focus:ring-2 focus:ring-purple-700 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-400 mt-4 bg-red-900/20 px-4 py-2 rounded">
          {error}
        </p>
      )}

      {/* No Data */}
      {!loading && wins.length === 0 && !error && (
        <div className="flex flex-col items-center mt-10">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--empty-result-search-error-pack-people-illustrations-4571557.png?f=webp"
            alt="No Data"
            className="w-48 mb-6"
          />
          <div className="bg-white px-5 py-2 rounded-full shadow-md">
            <p className="text-gray-700 text-sm font-medium">
              Winning History Data Not Available
            </p>
          </div>
        </div>
      )}

      {/* Show Win Table */}
      {wins.length > 0 && (
        <div className="w-[93%] mt-6 bg-gray-900 rounded-lg shadow-xl p-3">
          <h3 className="text-gray-200 mb-2 font-semibold">Winning Records</h3>

          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">TX ID</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {wins.map((w) => (
                <tr key={w.tx_id} className="border-b border-gray-800">
                  <td className="py-2 text-gray-300">
                    {w.tx_id.slice(0, 6)}...
                  </td>
                  <td className="py-2 text-green-400 font-bold">₹{w.amount}</td>
                  <td className="py-2 text-gray-400">
                    {new Date(w.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
