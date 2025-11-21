import React from "react";
import {
  ArrowLeft,
  Wallet,
  Gamepad2,
  Ticket,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
} from "lucide-react";

export default function MyBids() {
  const bidOptions = [
    {
      id: 1,
      title: "Bid History",
      desc: "you can add funds to your wallet",
      color: "bg-purple-600",
      icon: <Wallet size={22} className="text-white" />,
    },
    {
      id: 2,
      title: "Game Results",
      desc: "you can view market result history.",
      color: "bg-green-500",
      icon: <Gamepad2 size={22} className="text-white" />,
    },
    {
      id: 3,
      title: "Starline Bid History",
      desc: "you can starline history.",
      color: "bg-purple-400",
      icon: <Ticket size={22} className="text-white" />,
    },
    {
      id: 4,
      title: "Starline Result History",
      desc: "You can view starline result",
      color: "bg-red-500",
      icon: <ArrowDownCircle size={22} className="text-white" />,
    },
    {
      id: 5,
      title: "Jackpot Bid History",
      desc: "You can view your jackpot history",
      color: "bg-cyan-500",
      icon: <ArrowUpCircle size={22} className="text-white" />,
    },
    {
      id: 6,
      title: "Jackpot Result History",
      desc: "You can view your jackpot result",
      color: "bg-green-500",
      icon: <ArrowUpCircle size={22} className="text-white" />,
    },
  ];

  return (
    <div className="max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        {/* <button className="absolute left-4">
          <ArrowLeft size={22} className="text-white" />
        </button> */}
        <h1 className="text-lg font-semibold">My Bids</h1>
      </div>

      {/* Bids Options */}
      <div className="mt-3 pb-10 w-[94%] max-w-md mx-auto space-y-4">
        {bidOptions.map((item) => (
          <a
            href="/bid-history"
            key={item.id}
            className="flex items-center justify-between bg-white/20 rounded-xl shadow p-4 hover:shadow-md transition"
            // className="flex items-center  bg-white rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <div className="flex items-center">
              {/* Icon Box */}
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center shadow`}
              >
                {item.icon}
              </div>

              {/* Text Section */}
              <div className="ml-4 flex flex-col">
                <h3 className="text-sm font-bold text-gray-200">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300">{item.desc}</p>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight size={20} className="text-white" />
          </a>
        ))}
      </div>
    </div>
  );
}
