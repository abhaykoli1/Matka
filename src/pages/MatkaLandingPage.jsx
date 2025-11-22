import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Wallet,
  WalletCards,
  Info as InfoIcon,
  Play as PlayIcon,
  ChartScatter,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { API_URL } from "../config";
import axios from "axios";
import { FaChartBar, FaChartLine } from "react-icons/fa6";

const API_BASE_URL = `${API_URL}/market`;

// Fetch Markets
export const getAllMarkets = async () => {
  const response = await axios.get(API_BASE_URL + "/");
  console.log("API RESPONSE:", response);

  // axios uses status, not ok
  if (response.status !== 200) {
    throw new Error("Failed to fetch markets");
  }

  // backend sends:
  // { status: 'success', count: X, markets: [...] }
  const data = response.data;

  // validate
  if (data.status !== "success") {
    throw new Error("API returned error");
  }

  return data.markets; // return array
};

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch markets and format them for UI
  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllMarkets();

      // Format backend response to UI structure
      const formattedMarkets = data.map((m) => ({
        id: m.id,
        name: m.name,
        openTime: m.open_time,
        closeTime: m.close_time,
        result: m.final_result,
        status: m.status,
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

  return (
    <div className=" text-white font-sans ">
      <div className="flex flex-col max-w-md mx-auto h-screen">
        {/* Header Bar */}
        <div className="bg-gradient-to-b z-10 rounded-b-2xl from-[#03050e] via-[#192149] to-[#5a0572] px-4 py-3 flex flex-col items-center text-sm">
          <div className="w-full flex justify-between items-center">
            <a
              href="/add-points"
              className="flex font-medium items-center gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
            >
              <Wallet size={18} /> Add Points
            </a>
            <a
              href="withdraw-request"
              className="flex font-medium items-center gap-2 text-white px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
            >
              <WalletCards size={18} /> Withdraw
            </a>
          </div>

          <p className="p-1 px-2 rounded-xl shadow-2xl mt-3 backdrop-blur-2xl bg-white/30 w-full text-white text-center mb-2 opacity-90">
            🎯 Fast, fun & full of wins — Play Matka today!
          </p>

          <div className="flex gap-3 w-full justify-between">
            {/* <a
              href="how-to-play"
              className="backdrop-blur-md px-3 py-1 mt-3 bg-white/30 flex font-medium items-center gap-2 text-white text-sm rounded-full hover:bg-gray-700"
            >
              <PlayIcon size={15} /> How To Play
            </a> */}

            <button className="backdrop-blur-md px-3 py-1 mt-3 bg-white/30 flex font-medium items-center gap-2 text-white text-sm rounded-full hover:bg-gray-700">
              <BsWhatsapp /> Whatsapp
            </button>
          </div>
        </div>

        {/* MARKET LIST */}
        <main className="flex-1 -mt-4 !z-0 overflow-y-auto  bg-[rgba(20,25,51,1)] px-3 py-3 pb-14">
          {isLoading && (
            <div className="text-center mt-8">
              <p className="text-lg text-cyan-400">Loading markets...</p>
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

          {/* Market Cards */}
          <div className="mt-4 flex-1 space-y-2">
            {markets.map((mkt) => (
              <div
                key={mkt.id}
                className="w-full rounded-xl shadow-lg backdrop-blur2x bg-[rgba(255,255,255,0.27)]"
              >
                <div className="backdrop-blur-lg bg-black/40 rounded-xl p-3 flex flex-col text-white">
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
                        mkt.status === "Market Running"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {mkt.status}
                    </span>
                  </div>

                  {/* RESULT SECTION */}
                  <div className="border-b border-dashed border-cyan-400/25 mb-2"></div>

                  <div className="flex flex-wrap justify-between items-center text-xs text-gray-300">
                    <div>
                      <h3 className="text-2xl mb-1 font-bold text-[#ae13d9] tracking-wider">
                        {mkt.result ? mkt.result : "xxx-x-xxx"}
                      </h3>

                      <div className="flex gap-7">
                        <p className="flex flex-col">
                          <span className="text-gray-400">Open Time:</span>
                          <span className="text-white font-medium">
                            {mkt.openTime}
                          </span>
                        </p>

                        <p className="flex flex-col">
                          <span className="text-gray-400">Close Time:</span>
                          <span className="text-white font-medium">
                            {mkt.closeTime}
                          </span>
                        </p>
                      </div>
                    </div>

                    <a href={`/charts/${mkt.id}`}>
                      <FaChartLine size={26} />
                    </a>

                    <div className="flex flex-col items-center gap-1">
                      <a
                        href={
                          mkt.status === "Market Running"
                            ? `/play/${mkt.id}`
                            : ""
                        }
                        className={`w-10 h-10 rounded-full border-2 ${
                          mkt.status === "Market Running"
                            ? "border-white"
                            : "border-red-500"
                        }  flex items-center justify-center hover:bg-white/10 transition ${
                          mkt.status !== "Market Running"
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Play
                          className={`${
                            mkt.status === "Market Running"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                          size={18}
                        />
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
