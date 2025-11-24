// src/pages/WinningReport.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { Loader, Search as SearchIcon } from "lucide-react";
import { API_URL } from "../../../config";

// Use the screenshot you uploaded
const previewImage = "/mnt/data/Screenshot 2025-11-23 at 11.38.22 PM.png";

// Convert yyyy-mm-dd → dd/mm/yyyy for API
function formatDateForApi(yyyyMmDd) {
  if (!yyyyMmDd) return "";
  const [y, m, d] = yyyyMmDd.split("-");
  return `${d}/${m}/${y}`;
}

export default function WinningReport() {
  const [loading, setLoading] = useState(false);
  const [winningData, setWinningData] = useState([]);
  const [error, setError] = useState(null);

  // filters
  const [date, setDate] = useState("");
  const [marketId, setMarketId] = useState("all");
  const [gameType, setGameType] = useState("all");
  const [session, setSession] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("accessToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  // fetch report
  const fetchWinning = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      // date (required)
      const apiDate = formatDateForApi(date);
      if (!apiDate) {
        setError("Please select date");
        setWinningData([]);
        setLoading(false);
        return;
      }
      params.date = apiDate;

      if (marketId !== "all") params.market_id = marketId;
      if (gameType !== "all") params.game_type = gameType;
      if (session !== "all") params.session = session.toLowerCase();
      if (search) params.search = search;

      const res = await axios.get(`${API_URL}/admin/win/history`, {
        headers,
        params,
      });

      const list = Array.isArray(res.data?.data) ? res.data.data : [];

      setWinningData(list);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFilters = (e) => {
    e.preventDefault();
    fetchWinning();
  };

  const handleReset = () => {
    setDate("");
    setMarketId("all");
    setGameType("all");
    setSession("all");
    setSearch("");
    setWinningData([]);
    setError(null);
  };

  // Markets dropdown (derive from result names)
  const markets = useMemo(() => {
    const set = new Set();
    winningData.forEach((w) => w.market && set.add(w.market));
    return ["all", ...Array.from(set)];
  }, [winningData]);

  const gameTypes = useMemo(() => {
    const set = new Set();
    winningData.forEach((w) => w.game_type && set.add(w.game_type));
    return ["all", ...Array.from(set)];
  }, [winningData]);

  const totalWinning = useMemo(() => {
    return winningData.reduce((sum, w) => sum + Number(w.win_amount || 0), 0);
  }, [winningData]);

  return (
    <div className="lg:p-6 md:p-5 p-3 text-white">
      {/* Top Filter Card */}
      <div className="bg-white/5 border border-[rgba(255,255,255,0.04)] rounded-xl p-4 mb-5 backdrop-blur-sm">
        <div>
          {/* Filters */}
          <div className="flex-1">
            <h1 className="text-xl font-bold">Winning History Report</h1>
            <p className="text-sm text-slate-400 mt-1">
              Filter and view all winning bids.
            </p>

            <form
              onSubmit={handleSubmitFilters}
              className="mt-6 flex flex-wrap gap-4 items-end"
            >
              {/* Date */}
              <div className="flex-1">
                <label className="text-sm text-slate-300 mb-2 block">
                  Result Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 rounded text-white"
                />
              </div>

              {/* Game Name */}
              <div className="flex-1">
                <label className="text-sm text-slate-300 mb-2 block">
                  Game Name
                </label>
                <select
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 rounded text-white"
                >
                  {markets.map((m) => (
                    <option value={m} key={m}>
                      {m === "all" ? "All Games" : m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game Type */}
              <div className="flex-1">
                <label className="text-sm text-slate-300 mb-2 block">
                  Game Type
                </label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 rounded text-white"
                >
                  {gameTypes.map((g) => (
                    <option key={g} value={g}>
                      {g === "all" ? "All Types" : g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session */}
              <div className="flex-1">
                <label className="text-sm text-slate-300 mb-2 block">
                  Session
                </label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 rounded text-white"
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="close">Close</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex-1">
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded text-white"
                >
                  Get Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {/* Header Row */}
        <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Winning History List</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name / mobile"
                className="pl-10 pr-4 py-2 w-72 bg-white/10 border border-white/10 rounded text-white"
              />
              <SearchIcon
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />
            </div>

            <button
              onClick={() => fetchWinning()}
              className="px-3 py-2 bg-white/10 rounded border border-white/10"
            >
              Apply
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-white/10 rounded border border-white/10"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : error ? (
          <div className="p-5 text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-slate-200 bg-white/10 border-b border-white/10">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-3">Game</th>
                  <th className="py-3 px-3">Game Type</th>
                  <th className="py-3 px-3">Session</th>
                  <th className="py-3 px-3">Digit</th>
                  <th className="py-3 px-3">Points</th>
                  <th className="py-3 px-3">Won</th>
                </tr>
              </thead>

              <tbody>
                {winningData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-8 text-center text-slate-400"
                    >
                      No winning records found.
                    </td>
                  </tr>
                ) : (
                  winningData.map((w, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0 ? "bg-transparent" : "bg-white/5"
                      }
                    >
                      <td className="py-3 px-3">{idx + 1}</td>
                      <td className="py-3 px-3">{w.bid_date}</td>
                      <td className="py-3 px-3 text-sky-300">{w.name}</td>
                      <td className="py-3 px-3">{w.mobile}</td>
                      <td className="py-3 px-3">{w.market}</td>
                      <td className="py-3 px-3">{w.game_type}</td>
                      <td className="py-3 px-3">{w.session}</td>
                      <td className="py-3 px-3">{w.digit}</td>
                      <td className="py-3 px-3 font-semibold text-slate-100">
                        {w.points}
                      </td>
                      <td className="py-3 px-3 font-semibold text-sky-400">
                        {w.win_amount}
                      </td>
                    </tr>
                  ))
                )}

                {winningData.length > 0 && (
                  <tr className="border-t border-white/10">
                    <td
                      colSpan={9}
                      className="py-4 px-3 text-right font-semibold"
                    >
                      Total Winning:
                    </td>
                    <td className="py-4 px-3 text-sky-400 font-semibold">
                      {totalWinning}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
