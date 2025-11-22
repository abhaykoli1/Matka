import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";

export default function Chats() {
  const [marketName, setMarketName] = useState("");
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const { marketId } = useParams();

  // ------------------------------
  // FALLBACK TEST DATA (your sample)
  // ------------------------------
  const fallbackData = {
    market_name: "Sample Market",
    chart: [
      {
        date: "2025-02-10",
        day: "Mon",
        open_panna: "248",
        open_digit: "4",
        close_panna: "112",
        close_digit: "4",
      },
      {
        date: "2025-02-09",
        day: "Sun",
        open_panna: "680",
        open_digit: "4",
        close_panna: "570",
        close_digit: "2",
      },
      {
        date: "2025-02-08",
        day: "Sat",
        open_panna: "390",
        open_digit: "2",
        close_panna: "245",
        close_digit: "1",
      },
    ],
  };

  const fetchChart = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/market/chart/monthly/${marketId}`
      );

      if (!res.data || !res.data.chart || res.data.chart.length === 0) {
        // APPLY FALLBACK DATA AUTOMATICALLY
        setMarketName(fallbackData.market_name);
        setChart(fallbackData.chart);
      } else {
        setMarketName(res.data.market_name);
        setChart(res.data.chart);
      }
    } catch (err) {
      console.error("Error loading chart:", err);

      // SERVER FAILED → use fallback
      setMarketName(fallbackData.market_name);
      setChart(fallbackData.chart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
  }, [marketId]);

  // Group into rows of 7
  const rows = [];
  for (let i = 0; i < chart.length; i += 7) {
    rows.push(chart.slice(i, i + 7));
  }

  if (loading) {
    return (
      <div className="text-white text-center mt-10 text-lg">
        Loading Chart...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-20">
      {/* Title */}

      <div className="w-full bg-gradient-to-b from-black to-black/0 py-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold uppercase tracking-widest">
          {marketName.toUpperCase()} Chart
        </h1>
      </div>

      {/* Chart Container */}
      <div className="space-y-3">
        {rows.map((week, idx) => (
          <div key={idx} className="  p-3 ">
            <div className="grid grid-cols-2 gap-3">
              {week.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-600 rounded-lg p-1 bg-[#111426]"
                >
                  {/* Day + Date */}
                  <p className="text-center text-[11px] font-bold text-gray-300">
                    {item.day}
                  </p>
                  <p className="text-center text-[10px] text-gray-400">
                    {item.date}
                  </p>

                  {/* Open panna */}
                  <div className="grid grid-cols-3 text-[11px] text-gray-300 mt-1">
                    <p className="text-center">{item.open_panna[0]}</p>
                    <p className="text-center font-bold text-red-400">
                      {item.open_panna}
                    </p>
                    <p className="text-center">{item.open_panna[2]}</p>
                  </div>

                  <p className="text-center text-[11px] font-semibold text-white">
                    {item.open_digit}
                  </p>

                  {/* Close panna */}
                  <div className="grid grid-cols-3 text-[11px] text-gray-300 mt-1">
                    <p className="text-center">{item.close_panna[0]}</p>
                    <p className="text-center font-bold text-red-400">
                      {item.close_panna}
                    </p>
                    <p className="text-center">{item.close_panna[2]}</p>
                  </div>

                  <p className="text-center text-[11px] font-semibold text-white">
                    {item.close_digit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
