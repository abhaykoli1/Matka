import React from "react";
import {
  ArrowLeft,
  Wallet,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

export default function WalletPage() {
  const walletOptions = [
    {
      id: 1,
      title: "Wallet History",
      desc: "you can check your wallet history",
      color: "bg-purple-600",
      icon: <Wallet size={22} className="text-white" />,
    },
    {
      id: 2,
      link: "/add-points",
      title: "Add Money",
      desc: "you can add funds to your account.",
      color: "bg-green-500",
      icon: <PlusCircle size={22} className="text-white" />,
    },
    {
      id: 3,
      link: "/withdraw-history",
      title: "Withdrawal History",
      desc: "View your withdrawal transaction history",
      color: "bg-red-500",
      icon: <ArrowDownCircle size={22} className="text-white" />,
    },
    {
      id: 4,
      title: "Deposit History",
      desc: "View your deposit transaction history",
      color: "bg-cyan-500",
      icon: <ArrowUpCircle size={22} className="text-white" />,
    },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        {/* <button className="absolute left-4">
          <ArrowLeft size={22} className="text-white" />
        </button> */}
        <h1 className="text-lg font-semibold">Wallet</h1>
      </div>

      {/* Wallet Options */}
      <div className="mt-3.5 w-[93%] max-w-md mx-auto space-y-4">
        {walletOptions.map((item) => (
          <a
            href={item.link || "#"}
            key={item.id}
            className="flex items-center bg-white/20 rounded-xl shadow p-4 hover:shadow-md transition"
          >
            {/* Colored Icon Box */}
            <div
              className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center shadow`}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div className="ml-4 flex flex-col">
              <h3 className="text-sm font-bold text-gray-200">{item.title}</h3>
              <p className="text-xs text-gray-300">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
