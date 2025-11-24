// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Play } from "lucide-react";
// import { API_URL } from "../../config";

// const API_BASE = `${API_URL}/starline_jackpot`;

// const starlineRates = [
//   { label: "Single Digit", rate: "10 - 100" },
//   { label: "Single Panna", rate: "10 - 1600" },
//   { label: "Double Panna", rate: "10 - 3200" },
//   { label: "Triple Panna", rate: "10 - 7000" },
// ];

// export default function JackpotGame() {
//   const [marketData, setMarketData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   console.log(marketData);

//   // Fetch markets
//   const fetchMarketData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/jackpot/list`);

//       console.log(res);
//       setMarketData(res.data);
//     } catch (err) {
//       setError("Failed to load markets.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMarketData();
//   }, []);

//   // Rate row UI
//   const RateRow = ({ label, rate }) => (
//     <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//       <p className="text-gray-200 font-medium">{label}</p>
//       <p className="text-gray-200 font-bold">{rate}</p>
//     </div>
//   );

//   // Market card UI
//   const MarketCard = ({ market }) => (
//     <div className="flex items-center justify-between bg-white/20 rounded-xl shadow-md p-4 mb-3">
//       {/* LEFT CONTENT */}
//       <div className="flex flex-col">
//         <h3 className="text-xl font-bold text-gray-200 uppercase tracking-wider">
//           {market.name}
//         </h3>

//         <p
//           className={`${
//             market.status === "Market Running"
//               ? "text-green-500"
//               : "text-red-400"
//           } text-sm font-semibold mt-1`}
//         >
//           {market.status}
//         </p>

//         <p className="text-gray-200 text-sm mt-1">
//           Start: <span className="font-bold">{market.start_time}</span>
//         </p>

//         <p className="text-gray-200 text-sm">
//           End: <span className="font-bold">{market.end_time}</span>
//         </p>
//       </div>

//       {/* PLAY BUTTON */}
//       <a
//         href={
//           market.status === "Market Running"
//             ? `/jackpot/${market.id}`
//             : undefined
//         }
//         className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition
//     ${
//       market.status === "Market Running"
//         ? "bg-green-500 hover:bg-green-600"
//         : "bg-gray-600 pointer-events-none opacity-50"
//     }
//   `}
//       >
//         <Play size={20} color="white" fill="white" />
//       </a>
//     </div>
//   );

//   return (
//     <div className="max-w-md mx-auto font-sans pb-12">
//       {/* HEADER */}
//       <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center">
//         <h1 className="text-xl font-semibold">King JACKPOT</h1>
//       </div>

//       {/* RATE CARD */}
//       <div className="p-3">
//         <div className="bg-white/20 rounded-xl shadow-xl p-3 space-y-1 mb-4">
//           {starlineRates.map((item, index) => (
//             <RateRow key={index} label={item.label} rate={item.rate} />
//           ))}
//         </div>

//         {/* BUTTONS */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <a
//             href="/jackpot-bid-history"
//             className="bg-gradient-to-bl flex items-center justify-center from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg"
//           >
//             Bid History
//           </a>
//           <a
//             href="/jackpot-win-history"
//             className="bg-gradient-to-bl flex items-center justify-center from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-lg"
//           >
//             Win History
//           </a>
//         </div>

//         {/* MARKET CARDS */}
//         <div className="space-y-3">
//           {loading ? (
//             <p className="text-gray-300 text-center py-6">Loading markets...</p>
//           ) : error ? (
//             <p className="text-red-400 text-center py-6">{error}</p>
//           ) : marketData.length === 0 ? (
//             <p className="text-gray-400 text-center py-6">
//               No Starline markets available.
//             </p>
//           ) : (
//             marketData.map((market) => (
//               <MarketCard key={market.id} market={market} />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, Info, ArrowLeft } from "lucide-react";
import { FaChartLine } from "react-icons/fa6";
import { API_URL } from "../../config";

export default function JackpotGame() {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // CLEAN ID HELPER
  // ----------------------------
  const getId = (obj) => {
    if (!obj) return null;
    if (obj._id?.$oid) return obj._id.$oid;
    if (typeof obj._id === "string") return obj._id;
    if (obj.id) return obj.id;
    return null;
  };

  // ----------------------------
  // FETCH MARKETS (USER API)
  // ----------------------------
  const fetchMarkets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/Golidesawar/market`, {
        headers,
      });

      console.log("G Markets =", res);

      const list = (res.data?.data || []).map((m) => ({
        id: getId(m),
        name: m.name,
        openTime: m.open_time,
        closeTime: m.close_time,
        status: m.status,
        today_result: m.today_result || null,
      }));

      setMarkets(list);
    } catch (err) {
      console.error("User Golidesawar load error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        Loading Markets…
      </div>
    );
  }

  return (
    <div className="space-y-3 mx-auto max-w-md font-sans pb-20">
      <div className="w-full relative bg-gradient-to-b from-black to-black/0 py-2 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="p-2 pl-4 z-10 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h2 className="text-md z-0 w-full absolute font-bold px-4 py-2 flex justify-center items-center gap-2">
          <span className="flex gap-2 text-md items-center uppercase">
            King JAckpot
          </span>
        </h2>

        <div className="pr-4 z-10"></div>
      </div>

      <div className="px-3">
        <div className="w-full   bg-white/5 p-4 border border-gray-50/5 rounded-xl space-y-2">
          {/* Row 1 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-100 text-[13px]">
              Left Digit
            </span>
            <span className="font-semibold text-gray-100 text-[13px]">
              10–100
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-100 text-[13px]">
              Right Digit
            </span>
            <span className="font-semibold text-gray-100 text-[13px]">
              10–100
            </span>
          </div>

          {/* Row 3 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-100 text-[13px]">
              Jodi Digit
            </span>
            <span className="font-semibold text-gray-100 text-[13px]">
              10–1000
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex  gap-3 px-3 ">
        <a
          href="/king-bids-history"
          className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 px-3 w-full"
        >
          Bids History
        </a>
        <a
          href="/king-win-history"
          className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 px-3 w-full"
        >
          Win History
        </a>
      </div>

      <div className="px-3 flex flex-col gap-3">
        {markets.map((mkt) => {
          const openDigit = mkt.today_result?.open_digit || "X";
          const closeDigit = mkt.today_result?.close_digit || "X";

          return (
            <div
              key={mkt.id}
              className="w-full rounded-xl shadow-lg backdrop-blur-2xl border border-white/10"
            >
              <div className="rounded-xl p-3 text-white">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-semibold uppercase">
                      {mkt.name}
                    </h2>

                    <Info
                      size={18}
                      className="bg-gray-300 rounded-full text-black"
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      mkt.status ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {mkt.status ? "Running" : "Closed"}
                  </span>
                </div>

                {/* LINE */}
                <div className="border-b border-dashed border-cyan-400/25 mb-2"></div>

                {/* DETAILS */}
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <div>
                    {/* RESULT */}
                    <h3 className="text-xl mb-1 font-semibold text-[#c21af0]">
                      {openDigit}
                      {closeDigit}
                    </h3>

                    <div className="flex gap-7">
                      <p>
                        <span className="text-gray-400">Open Time:</span>
                        <span className="block text-white font-medium">
                          {mkt.openTime}
                        </span>
                      </p>

                      <p>
                        <span className="text-gray-400">Close Time:</span>
                        <span className="block text-white font-medium">
                          {mkt.closeTime}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <a href={`/charts/golidesawar/${mkt.id}`}>
                    <FaChartLine size={26} />
                  </a>

                  {/* Play */}
                  <div className="flex flex-col items-center gap-1">
                    <a
                      href={mkt.status ? `/king/${mkt.id}` : ""}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        mkt.status
                          ? "border-white"
                          : "border-red-400 cursor-not-allowed"
                      }`}
                    >
                      <Play
                        className={
                          mkt.status ? "text-green-500" : "text-red-400"
                        }
                        size={18}
                      />
                    </a>
                    <span className="text-[14px] font-semibold">Play</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
