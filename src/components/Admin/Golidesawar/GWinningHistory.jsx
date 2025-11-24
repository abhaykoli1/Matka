import React, { useState } from "react";
import axios from "axios";

export default function GWinningHistory() {
  const [filters, setFilters] = useState({
    date: "",
    game: "ALL",
    type: "ALL",
    session: "ALL",
  });

  const [list, setList] = useState([]);

  const submitFilter = async () => {
    try {
      const res = await axios.get("/api/admin/Golidesawar/winning-report", {
        params: {
          date: filters.date,
          market_id: filters.game === "ALL" ? null : filters.game,
          game_type: filters.type === "ALL" ? null : filters.type,
          session: filters.session === "ALL" ? null : filters.session,
        },
      });
      setList(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4 text-white">Select Game</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-800 p-5 rounded-lg border border-white/10">
        <div>
          <label className="text-gray-300 font-semibold">Result Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full bg-gray-900 border border-white/10 p-2 rounded mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 font-semibold">Game Name</label>
          <select
            value={filters.game}
            onChange={(e) => setFilters({ ...filters, game: e.target.value })}
            className="w-full bg-gray-900 border border-white/10 p-2 rounded mt-1 text-white"
          >
            <option value="ALL">All Games</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 font-semibold">Game Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full bg-gray-900 border border-white/10 p-2 rounded mt-1 text-white"
          >
            <option value="ALL">All Games</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 font-semibold">Session</label>
          <select
            value={filters.session}
            onChange={(e) =>
              setFilters({ ...filters, session: e.target.value })
            }
            className="w-full bg-gray-900 border border-white/10 p-2 rounded mt-1 text-white"
          >
            <option value="ALL">All</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </div>
      </div>

      <button
        onClick={submitFilter}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        GET REPORT
      </button>

      <div className="mt-10 bg-gray-800 p-5 rounded-lg border border-white/10">
        <h2 className="text-lg font-bold mb-4 text-white">
          Winning History List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-white/10 bg-gray-700 text-gray-200">
                <th className="p-2">#</th>
                <th className="p-2">Date</th>
                <th className="p-2">User</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Game</th>
                <th className="p-2">Game Type</th>
                <th className="p-2">Session</th>
                <th className="p-2">Open Digit</th>
                <th className="p-2">Close Digit</th>
                <th className="p-2">Open Panna</th>
                <th className="p-2">Close Panna</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Won Amount</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-400" colSpan={13}>
                    No Data Found
                  </td>
                </tr>
              ) : (
                list.map((item, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.user}</td>
                    <td className="p-2">{item.mobile}</td>
                    <td className="p-2">{item.game_name}</td>
                    <td className="p-2">{item.game_type}</td>
                    <td className="p-2">{item.session}</td>
                    <td className="p-2">{item.open_digit || "-"}</td>
                    <td className="p-2">{item.close_digit || "-"}</td>
                    <td className="p-2">{item.open_panna || "-"}</td>
                    <td className="p-2">{item.close_panna || "-"}</td>
                    <td className="p-2">{item.points}</td>
                    <td className="p-2 text-green-400">{item.win_amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
