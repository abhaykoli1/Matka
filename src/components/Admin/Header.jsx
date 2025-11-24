import React from "react";
import { Menu } from "lucide-react";
import logo from "../../assets/logo.png";
export default function Header({ setSidebarOpen }) {
  return (
    <div className="bg-[#0d1227 bg-black shadow-md flex items-center justify-between px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="px-2 py-1.5 rounded-md  border lg:hidden md:hidden block hover:bg-gray-700/30"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
      </div>
      <img src={logo} alt="Admin" className="w-10 h-10 rounded-full " />
    </div>
  );
}
