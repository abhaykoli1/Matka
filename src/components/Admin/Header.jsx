import React from "react";
import { Menu } from "lucide-react";

export default function Header({ setSidebarOpen }) {
  return (
    <div className="bg-[#0d1227] shadow-md flex items-center justify-between px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-blue-600">Home</h1>
      </div>
      <img
        src="/profile.jpg"
        alt="Admin"
        className="w-10 h-10 rounded-full border-2 border-blue-400"
      />
    </div>
  );
}
