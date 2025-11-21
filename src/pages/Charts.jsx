import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getAllMarkets } from "./Admin/Market/marketapi";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/chart`;

// 🟩 Safe converter for panna → chart row
const convertResultToNumbers = (r) => {
  const open = r.open_panna || "-";
  const close = r.close_panna || "-";

  const left1 = open[0] || "-";
  const left2 = open[1] || "-";

  const center = open !== "-" && close !== "-" ? `${open}${close}` : "-";

  const right1 = close[0] || "-";
  const right2 = close[1] || "-";

  return [left1, left2, center, right1, right2];
};

export default function Charts() {
  const [markets, setMarkets] = useState([]);
  const [marketId, setMarketId] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Fetch Markets (Dropdown)
  // ---------------------------
  const fetchMarkets = useCallback(async () => {
    try {
      const data = await getAllMarkets();
      setMarkets(data);

      // Set default selected market
      if (data.length > 0 && !marketId) {
        setMarketId(data[0]._id.$oid);
      }
    } catch (err) {
      console.error("Market Load Error:", err);
    }
  }, [marketId]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // ---------------------------
  // Fetch Chart Data (Dynamic)
  // ---------------------------
  const fetchChart = async () => {
    if (!marketId) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/${marketId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Fix case: if backend returns empty list
      setResults(res.data?.length ? res.data.reverse() : []);
    } catch (err) {
      console.log("Chart load error:", err);
      setResults([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchChart();
  }, [marketId]);

  // ---------------------------
  // Group Results into Weeks
  // ---------------------------
  const groupedByWeek = [];
  for (let i = 0; i < results.length; i += 7) {
    groupedByWeek.push(results.slice(i, i + 7));
  }

  // ---------------------------
  // Day Cell Component
  // ---------------------------
  const DayResult = ({ day, date, nums }) => {
    const centerValue = nums[2];

    return (
      <div className="flex flex-col border border-gray-400 p-0 text-center w-full">
        <div className="bg-white/20 p-1 border-b">
          <div className="font-bold text-sm">{day}</div>
          <div className="text-xs">({date})</div>
        </div>

        <div className="grid grid-cols-5 divide-x divide-gray-400 h-full">
          <div className="flex flex-col text-xs text-black justify-evenly">
            <div>{nums[0]}</div>
            <div>{nums[1]}</div>
          </div>

          <div className="col-span-3 flex items-center justify-center bg-white p-2 text-xs font-extrabold">
            <span
              className={`${
                !isNaN(Number(centerValue)) && Number(centerValue) < 50
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              {centerValue}
            </span>
          </div>

          <div className="flex flex-col text-xs text-gray-700 justify-evenly">
            <div>{nums[3]}</div>
            <div>{nums[4]}</div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------
  // LOADING VIEW
  // ---------------------------
  if (loading) {
    return (
      <div className="text-center text-gray-400 p-6">Loading chart...</div>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="h-full flex flex-col max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center py-4 text-white bg-gradient-to-b from-black to-black/0">
        <h2 className="text-lg font-bold">RESULT CHART</h2>

        {/* Market Dropdown */}
        <select
          className="mt-3 text-black px-3 py-2 rounded bg-white shadow"
          value={marketId || ""}
          onChange={(e) => setMarketId(e.target.value)}
        >
          {markets.map((m) => (
            <option key={m._id.$oid} value={m._id.$oid}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* No Results */}
      {results.length === 0 && (
        <div className="text-center text-gray-400 p-6">
          No results available for this market.
        </div>
      )}

      {/* Chart Content */}
      <div className="p-4 mx-auto w-full">
        {groupedByWeek.map((week, idx) => (
          <div key={idx} className="flex mb-4 w-full">
            {week.map((day, i) => {
              const nums = convertResultToNumbers(day);
              return (
                <div key={i} className="flex-1 min-w-0">
                  <DayResult
                    day={new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                    date={new Date(day.date).toLocaleDateString("en-GB")}
                    nums={nums}
                  />
                </div>
              );
            })}

            {/* Fill blank days */}
            {week.length < 7 &&
              [...Array(7 - week.length)].map((_, blank) => (
                <div key={blank} className="flex-1 min-w-0"></div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
