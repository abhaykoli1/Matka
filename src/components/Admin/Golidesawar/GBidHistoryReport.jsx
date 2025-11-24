import React, { useState } from "react";
import axios from "axios";

export default function GBidHistoryReport() {
  const [filters, setFilters] = useState({
    date: "",
    game: "ALL",
    type: "ALL",
    session: "ALL",
    search: "",
  });

  const [list, setList] = useState([]);

  const submitFilter = async () => {
    try {
      const res = await axios.get("/api/admin/Golidesawar/history", {
        params: {
          date_from: filters.date,
          date_to: filters.date,
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

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const filteredList = list.filter((item) =>
    Object.values(item)
      ?.join(" ")
      ?.toLowerCase()
      ?.includes(filters.search.toLowerCase())
  );

  return (
    <div className="lg:p-6 md:p-5 p-3 w-full">
      <h1 className="text-xl font-bold mb-4 text-gray-200">
        Bid History Report
      </h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-5 rounded-lg shadow">
        {/* Date */}
        <div>
          <label className="text-gray-300 font-semibold">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full border border-white/10 p-2 rounded mt-1"
          />
        </div>

        {/* Game Name */}
        <div>
          <label className="text-gray-300 font-semibold">Game Name</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={filters.game}
            onChange={(e) => setFilters({ ...filters, game: e.target.value })}
          >
            <option value="ALL">ALL Game</option>
          </select>
        </div>

        {/* Game Type */}
        <div>
          <label className="text-gray-300 font-semibold">Game Type</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="ALL">All Games</option>
          </select>
        </div>

        {/* Session */}
        <div>
          <label className="text-gray-300 font-semibold">Session</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={filters.session}
            onChange={(e) =>
              setFilters({ ...filters, session: e.target.value })
            }
          >
            <option value="ALL">All</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </div>
        <button
          onClick={submitFilter}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {/* Submit */}

      {/* LIST */}
      <div className="mt-10 bg-white/5 p-5 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 text-gray-200">
          Bid History List
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={filters.search}
          onChange={handleSearch}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b bg-gray-700 text-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Bid Date</th>
                <th className="p-2">Bid Time</th>
                <th className="p-2">Game Name</th>
                <th className="p-2">Game Type</th>
                <th className="p-2">Session</th>
                <th className="p-2">Open Digit</th>
                <th className="p-2">Close Digit</th>
                <th className="p-2">Open Panna</th>
                <th className="p-2">Close Panna</th>
                <th className="p-2">Points</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-400" colSpan={14}>
                    No Data Found
                  </td>
                </tr>
              ) : (
                filteredList.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.mobile}</td>
                    <td className="p-2">{item.created_at?.split("T")[0]}</td>
                    <td className="p-2">
                      {item.created_at?.split("T")[1]?.slice(0, 5)}
                    </td>
                    <td className="p-2">{item.market_id}</td>
                    <td className="p-2">{item.game_type}</td>
                    <td className="p-2">{item.session}</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2">{item.points}</td>
                    <td className="p-2 text-green-500">Success</td>
                    <td className="p-2">---</td>
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
