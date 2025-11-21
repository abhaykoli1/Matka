// import React from "react";
// import {
//   Menu,
//   Info,
//   Play,
//   Wallet,
//   WalletCards,
//   InfoIcon,
//   PlayIcon,
// } from "lucide-react";
// import { BsWhatsapp } from "react-icons/bs";

// export default function Dashboard() {
//   const markets = [
//     {
//       id: "karnataka-day",
//       name: "KARNATAKA DAY",
//       result: "225-91-146",
//       openTime: "10:00 AM",
//       closeTime: "11:00 AM",
//       status: "Closed for Today",
//     },
//     {
//       name: "MILAN MORNING",
//       result: "579-11-579",
//       openTime: "10:15 AM",
//       closeTime: "11:15 AM",
//       status: "Closed for Today",
//     },
//     {
//       name: "MILAN MORNING",
//       result: "579-11-579",
//       openTime: "10:15 AM",
//       closeTime: "11:15 AM",
//       status: "Closed for Today",
//     },
//     {
//       name: "MILAN MORNING",
//       result: "579-11-579",
//       openTime: "10:15 AM",
//       closeTime: "11:15 AM",
//       status: "Closed for Today",
//     },
//   ];

//   return (
//     <div className=" text-white font-sans ">
//       <div className="flex flex-col max-w-md mx-auto">
//         {/* Top Header */}

//         {/* Top Buttons Section */}

//         {/* Gradient Banner Section */}
//         <div className="bg-gradient-to-b z-10 rounded-b-2xl from-[#03050e] via-[#192149] to-[#5a0572] px-4 py-3 flex flex-col items-center text-sm">
//           <div className="w-full  flex justify-between items-center">
//             <button className="flex font-medium items-center  gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700">
//               <Wallet size={18} /> Add Fund
//             </button>
//             <a
//               href="withdraw-request"
//               className="flex font-medium items-center  gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
//             >
//               <WalletCards size={18} /> Withdraw
//             </a>
//           </div>
//           <p className=" p-1 px-2 rounded-xl shadow-2xl mt-3 backdrop-blur-2xl bg-white/30 w-full text-white text-center mb-2 opacity-90">
//             🎯 Fast, fun & full of wins — Play Matka today!
//           </p>
//           <div className="flex gap-3 w-full justify-between">
//             <a
//               href="how-to-play"
//               className="backdrop-blur-md px-3 py-1  mt-3 bg-white/30 flex font-medium items-center  gap-2 text-white  text-sm rounded-full  hover:bg-gray-700"
//             >
//               <PlayIcon size={15} /> How To Play
//             </a>
//             <button className="backdrop-blur-md px-3 py-1   mt-3 bg-white/30 flex font-medium items-center  gap-2 text-white  text-sm rounded-full  hover:bg-gray-700">
//               <BsWhatsapp /> Whatsapp
//             </button>
//           </div>
//         </div>

//         {/* Market List */}
//         <main className="flex-1 -mt-4  !z-0 overflow-y-auto bg-[rgba(20,25,51,1)] px-3 py-3  pb-14">
//           <div className="mt-4 flex-1 space-y-2">
//             {markets.map((mkt, i) => (
//               <div className="w-full rounded-xl shadow-lg  backdrop-blur2x bg-[rgba(255,255,255,0.27)] ">
//                 {/* Inner blurred background with transparency */}
//                 <div className="backdrop-blur-lg bg-black/40 rounded-xl p-3 flex flex-col text-white">
//                   {/* Header Row */}
//                   <div className="flex justify-between flex-wrap items-center mb-2">
//                     <div className="flex items-center gap-1">
//                       <h2 className="text-base font-semibold uppercase tracking-wide">
//                         {mkt?.name}
//                       </h2>
//                       <InfoIcon
//                         size={18}
//                         className="bg-gray-300 rounded-full text-black"
//                       />
//                     </div>
//                     <span className="text-red-400 text-xs font-semibold">
//                       {mkt?.status}
//                     </span>
//                   </div>

//                   {/* Result */}
//                   <div className="border-b border-dashed border-cyan-400/25"></div>
//                   <div className="relative mb-2"></div>

//                   {/* Times and Play button */}
//                   <div className="flex flex-wrap justify-between items-center text-xs text-gray-300">
//                     <div>
//                       <h3 className="text-2xl mb-1 font-bold text-cyan-400 tracking-wider">
//                         {mkt?.result}
//                       </h3>
//                       <div className="flex  gap-7">
//                         <p className="flex flex-col">
//                           <span className="text-gray-400">Open Time:</span>{" "}
//                           <span className="text-white font-medium">
//                             {mkt?.openTime}
//                           </span>
//                         </p>
//                         <p className="flex flex-col">
//                           <span className="text-gray-400">Close Time:</span>{" "}
//                           <span className="text-white font-medium">
//                             {mkt?.closeTime}
//                           </span>
//                         </p>
//                       </div>
//                     </div>

//                     {/* Circular Play Button */}
//                     <div className="flex flex-col items-center gap-1">
//                       <a
//                         href={`/rajdhani-day/${mkt?.id}`}
//                         className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition"
//                       >
//                         <Play size={18} />
//                       </a>
//                       <span className="text-[14px] text-white font-medium">
//                         Play Game
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Info,
  Play,
  Wallet,
  WalletCards,
  InfoIcon,
  PlayIcon,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

// 1. API Call Function
const API_BASE_URL = "http://127.0.0.1:8000/market"; // **Adjust the port if necessary**

export const getAllMarkets = async () => {
  // The previous API was /market/, but assuming the data fetching logic is the same:
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch markets");
  }
  const data = await response.json();
  // Your FastAPI returns {"markets": [...], "status": "success"}
  return data.markets;
};

export default function Dashboard() {
  // 2. Use State to manage fetched data and loading status
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Use useCallback and useEffect to fetch data
  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllMarkets();
      // Since your frontend expects a 'result' key (e.g., "225-91-146"),
      // but your backend model provides 'open_result' and 'close_result',
      // we must map the data to combine them into a single 'result' string
      // for the existing UI code to work correctly.
      const formattedMarkets = data.map((market) => ({
        // Using the ID from MongoEngine's JSON serialization structure
        id: market._id.$oid,
        name: market.name,
        // Combining open_result, is_active (for status), and close_result
        result: `${market.open_result}-${market.close_result}`,
        openTime: market.open_time,
        closeTime: market.close_time,
        // A simple status based on is_active (you might want more complex logic later)
        status: market.is_active ? "Open Today" : "Closed for Today",
        // Include other fields for potential future use
        ...market,
      }));

      setMarkets(formattedMarkets);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load market data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Placeholder markets array is no longer needed

  return (
    <div className=" text-white font-sans ">
      <div className="flex flex-col max-w-md mx-auto">
        {/* Gradient Banner Section (Unchanged) */}
        <div className="bg-gradient-to-b z-10 rounded-b-2xl from-[#03050e] via-[#192149] to-[#5a0572] px-4 py-3 flex flex-col items-center text-sm">
          <div className="w-full  flex justify-between items-center">
            <a
              href="/add-points"
              className="flex font-medium items-center  gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
            >
              <Wallet size={18} /> Add Points
            </a>
            <a
              href="withdraw-request"
              className="flex font-medium items-center  gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
            >
              <WalletCards size={18} /> Withdraw
            </a>
          </div>
          <p className=" p-1 px-2 rounded-xl shadow-2xl mt-3 backdrop-blur-2xl bg-white/30 w-full text-white text-center mb-2 opacity-90">
            🎯 Fast, fun & full of wins — Play Matka today!
          </p>
          <div className="flex gap-3 w-full justify-between">
            <a
              href="how-to-play"
              className="backdrop-blur-md px-3 py-1  mt-3 bg-white/30 flex font-medium items-center  gap-2 text-white  text-sm rounded-full  hover:bg-gray-700"
            >
              <PlayIcon size={15} /> How To Play
            </a>
            <button className="backdrop-blur-md px-3 py-1   mt-3 bg-white/30 flex font-medium items-center  gap-2 text-white  text-sm rounded-full  hover:bg-gray-700">
              <BsWhatsapp /> Whatsapp
            </button>
          </div>
        </div>

        {/* Market List */}
        <main className="flex-1 -mt-4  !z-0 overflow-y-auto bg-[rgba(20,25,51,1)] px-3 py-3  pb-14">
          {/* Loading / Error States */}
          {isLoading && (
            <div className="text-center mt-8">
              <p className="text-lg text-cyan-400">Loading markets...</p>
              {/* You could add a simple spinner here */}
            </div>
          )}

          {error && (
            <div className="text-center mt-8 p-4 bg-red-800/50 border border-red-500 rounded-lg">
              <p className="text-lg text-red-300">{error}</p>
            </div>
          )}

          {!isLoading && markets.length === 0 && !error && (
            <div className="text-center mt-8">
              <p className="text-lg text-gray-400">No markets found.</p>
            </div>
          )}

          <div className="mt-4 flex-1 space-y-2">
            {markets.map((mkt, i) => (
              <div
                key={mkt.id}
                className="w-full rounded-xl shadow-lg  backdrop-blur2x bg-[rgba(255,255,255,0.27)] "
              >
                {/* Inner blurred background with transparency */}
                <div className="backdrop-blur-lg bg-black/40 rounded-xl p-3 flex flex-col text-white">
                  {/* Header Row */}
                  <div className="flex justify-between flex-wrap items-center mb-2">
                    <div className="flex items-center gap-1">
                      <h2 className="text-base font-semibold uppercase tracking-wide">
                        {mkt?.name}
                      </h2>
                      <InfoIcon
                        size={18}
                        className="bg-gray-300 rounded-full text-black"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        mkt?.status.startsWith("Open")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {mkt?.status}
                    </span>
                  </div>

                  {/* Result */}
                  <div className="border-b border-dashed border-cyan-400/25 mb-2"></div>

                  {/* Times and Play button */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-gray-300">
                    <div>
                      <h3 className="text-2xl mb-1 font-bold text-cyan-400 tracking-wider">
                        {mkt?.result}{" "}
                        {/* Now uses the combined result from the backend data */}
                      </h3>
                      <div className="flex  gap-7">
                        <p className="flex flex-col">
                          <span className="text-gray-400">Open Time:</span>{" "}
                          <span className="text-white font-medium">
                            {mkt?.openTime}
                          </span>
                        </p>
                        <p className="flex flex-col">
                          <span className="text-gray-400">Close Time:</span>{" "}
                          <span className="text-white font-medium">
                            {mkt?.closeTime}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Circular Play Button */}
                    <div className="flex flex-col items-center gap-1">
                      <a
                        href={`/play/${mkt?.id}`}
                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition"
                      >
                        <Play size={18} />
                      </a>
                      <span className="text-[14px] text-white font-medium">
                        Play Game
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
