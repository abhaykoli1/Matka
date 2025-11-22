import React from "react";
import { ArrowLeft } from "lucide-react";

export default function GameRatePage() {
  const rates = [
    { label: "Single Digit", rate: "10-100" },
    { label: "Jodi Digit", rate: "10-1000" },
    { label: "Single Panna", rate: "10-1600" },
    { label: "Double Panna", rate: "10-3200" },
    { label: "Tripple Panna", rate: "10-7000" },
    { label: "Half Sangam", rate: "10-10000" },
    { label: "Full Sangam", rate: "10-100000" },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen font-sans">
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        <h1 className="text-xl font-semibold">Game Rate</h1>
      </div>

      {/* LIST */}
      <div className="mt-2 px-4 space-y-3">
        {rates.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white/20 text-white py-2 px-4 rounded-lg shadow-md"
          >
            <span className="text-md font-medium">{item.label}</span>
            <span className="text-md font-semibold">{item.rate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
