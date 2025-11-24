import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, Info, ArrowLeft } from "lucide-react";
import { FaChartLine } from "react-icons/fa6";
import { API_URL } from "../../config";

export default function StarlineMarket() {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/user/starline/`, {
        headers,
      });

      console.log(res);

      // Clean response
      const list = (res.data?.data || []).map((m) => ({
        id: m._id?.$oid,
        name: m.name,
        openTime: m.open_time,
        closeTime: m.close_time,
        status: m.status,
        today_result: m.today_result,
      }));

      setMarkets(list);
    } catch (err) {
      console.error("Starline load error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white">
        Loading Starline Markets…
      </div>
    );
  }

  return (
    <div className=" space-y-3  mx-auto max-w-md font-sans pb-20">
      <div className="w-full relative bg-gradient-to-b from-black to-black/0 py-2 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="p-2 pl-4 z-10 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-md z-0 w-full absolute   justify-between font-bold bg-gradient-to-b from-black to-black/0 px-4 py-2  flex justify-center items-center gap-2">
          <span className="flex gap-2 text-md items-center uppercase">
            StarLine
          </span>
        </h2>
        <a className="pr-4 z-10"></a>
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
          href="/bid-history"
          className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 px-3 w-full"
        >
          Bids History
        </a>
        <a
          href="/win-history"
          className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 px-3 w-full"
        >
          Win History
        </a>
      </div>
      <div className="px-3">
        {markets.map((mkt) => {
          // Extract results safely
          const openPanna = mkt.today_result?.open_panna || "XXX";
          const openDigit = mkt.today_result?.open_digit || "X";

          const closeDigit = mkt.today_result?.close_digit || "X";
          const closePanna = mkt.today_result?.close_panna || "XXX";

          return (
            <div
              key={mkt.id}
              className="w-full rounded-xl shadow-lg  backdrop-blur-2xl border border-white/10"
            >
              <div className="rounded-xl p-3 text-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-semibold uppercase tracking-wide">
                      {mkt.name}
                    </h2>
                    <Info
                      size={18}
                      className="bg-gray-300 rounded-full text-black"
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      mkt.status === true ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {mkt.status === true ? "Running" : "Closed"}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-b border-dashed border-cyan-400/25 mb-2"></div>

                {/* Result + times */}
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <div>
                    {/* Result */}
                    <h3 className="text-2xl mb-1 font-semibold text-[#c21af0] tracking-wider">
                      {openPanna}-{openDigit}
                      {closeDigit}-{closePanna}
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

                  {/* Chart Button */}
                  <a href={`/charts/${mkt.id}`}>
                    <FaChartLine size={26} />
                  </a>

                  {/* Play Button */}
                  <div className="flex flex-col items-center gap-1">
                    <a
                      href={mkt.status === true ? `/play/${mkt.id}` : ""}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        mkt.status === true
                          ? "border-white"
                          : "border-red-400 cursor-not-allowed"
                      }`}
                    >
                      <Play
                        className={
                          mkt.status === true
                            ? "text-green-500"
                            : "text-red-400"
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
