import React from "react";

export default function DashboardCard({ title, value, subtext, color, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white`}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
    </div>
  );
}
