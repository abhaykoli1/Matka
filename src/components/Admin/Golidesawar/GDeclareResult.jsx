import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function formatDateISO(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function toNiceDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB"); // DD/MM/YYYY
  } catch {
    return d;
  }
}

function getId(obj) {
  if (!obj) return null;
  if (obj._id) {
    if (typeof obj._id === "string") return obj._id;
    if (obj._id.$oid) return obj._id.$oid;
    return obj._id;
  }
  if (obj.id) return obj.id;
  return null;
}

// ADD TOKEN AUTOMATICALLY
function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
}

export default function GDeclareResultPage() {
  const [date, setDate] = useState(formatDateISO());
  const [markets, setMarkets] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [digit, setDigit] = useState("");

  const declaredIds = results.map((r) => r.market_id);

  function formatDateISO(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // LOAD MARKETS
  const loadMarkets = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/market`,
        authHeader()
      );
      setMarkets(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Market load failed");
    }
  };

  // LOAD RESULTS
  const fetchResults = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/results?date=${date}`,
        authHeader()
      );
      setResults(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Result fetch failed");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMarkets();
    fetchResults();
  }, [date]);

  // INPUT HANDLER
  const handleInput = (e) => {
    let v = e.target.value;

    // only numbers + "-" allowed
    v = v.replace(/[^0-9-]/g, "");

    // CLOSE digit case: "-X"
    if (v.startsWith("-")) {
      v = "-" + v.replace("-", "").slice(0, 1); // only 1 digit allowed
    } else {
      v = v.slice(0, 2); // jodi max 2 digits
    }
    setDigit(v);
  };

  // DECLARE RESULT LOGIC
  const handleDeclare = async () => {
    if (!selectedMarketId) return alert("Select a market first!");
    let val = digit.trim();
    if (!val) return alert("Enter valid digit!");

    let payload = {
      game_id: selectedMarketId,
      date,
      session: "close",
    };

    // CASE 1: Single digit → open digit
    if (val.length === 1 && !val.startsWith("-")) {
      payload.session = "open";
      payload.digit = val;
    }

    // CASE 2: Close digit → "-X"
    else if (val.startsWith("-")) {
      if (val.length !== 2) return alert("Close digit format must be '-X'");
      payload.session = "close";
      payload.digit = val[1];
    }

    // CASE 3: Jodi → "XY"
    else if (val.length === 2) {
      payload.session = "close";
      payload.digit = val;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/api/admin/Golidesawar/result/declare`,
        payload,
        authHeader()
      );

      alert("Result Declared Successfully");
      setSelectedMarketId("");
      setDigit("");
      fetchResults();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error declaring result");
    } finally {
      setLoading(false);
    }
  };

  // DELETE RESULT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      await axios.delete(
        `${API_URL}/api/admin/Golidesawar/result/${id}`,
        authHeader()
      );
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className=" lg:p-6 p-3 text-white">
      {/* SELECT MARKET BLOCK */}
      <div className="bg-white/5 rounded-xl p-4 shadow border border-white/5">
        <h2 className="text-xl font-semibold mb-4">Declare Result</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DATE */}
          <div>
            <label className="text-gray-300">Result Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full p-3 rounded  border border-gray-50/10"
            />
          </div>

          {/* GAME SELECT */}
          <div>
            <label className="text-gray-300">Game Name</label>
            <select
              className="mt-1 w-full p-3 rounded  border border-gray-50/10"
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
            >
              <option value="">Select Game Name</option>

              {markets
                .filter((m) => !declaredIds.includes(getId(m)))
                .map((m) => {
                  let id = getId(m);
                  return (
                    <option key={id} value={id}>
                      {m.name} ( {m.open_time} - {m.close_time} )
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        {/* SHOW ONLY AFTER MARKET SELECTED */}
        {selectedMarketId && (
          <div className="mt-6">
            <label className="text-gray-300 mb-1 block">
              Enter Digit (Single / -X / Jodi)
            </label>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <input
                value={digit}
                onChange={handleInput}
                className="p-3 rounded bg-gray-900 border border-white/10 w-full md:w-1/3"
                placeholder="Eg: 5, -3, 24"
              />

              <button
                onClick={handleDeclare}
                disabled={loading}
                className="bg-green-600 px-6 py-2 rounded font-bold"
              >
                DECLARE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RESULT HISTORY */}
      <div className="mt-8 bg-white/5 p-4 rounded-xl shadow border border-gray-50/10">
        {/* FILTERS */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Result History</h3>

          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 rounded  border border-gray-50/10"
            />
            {/* <button
              onClick={fetchResults}
              className="bg-indigo-600 px-4 py-2 rounded"
            >
              Filter
            </button> */}
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-300 text-sm">
                <th className="px-4 py-2 border-b border-white/10">#</th>
                <th className="px-4 py-2 border-b border-white/10">Game</th>
                <th className="px-4 py-2 border-b border-white/10">Date</th>
                <th className="px-4 py-2 border-b border-white/10">Open</th>
                <th className="px-4 py-2 border-b border-white/10">Close</th>
                <th className="px-4 py-2 border-b border-white/10">Action</th>
              </tr>
            </thead>

            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : results?.length ? (
                results.map((r, i) => {
                  const id = r._id || r.id || getId(r);
                  return (
                    <tr key={id} className="bg-gray-900/20">
                      <td className="px-4 py-2 border-b border-white/10">
                        {i + 1}
                      </td>
                      <td className="px-4 py-2 border-b border-white/10">
                        {r.game_name}
                      </td>
                      <td className="px-4 py-2 border-b border-white/10">
                        {toNiceDate(r.date)}
                      </td>
                      <td className="px-4 py-2 border-b border-white/10">
                        {r.open_digit}
                      </td>
                      <td className="px-4 py-2 border-b border-white/10">
                        {r.close_digit}
                      </td>
                      <td className="px-4 py-2 border-b border-white/10">
                        <button
                          onClick={() => handleDelete(id)}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
