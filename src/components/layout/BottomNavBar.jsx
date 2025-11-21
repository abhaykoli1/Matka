import React from "react";
import { Home, TrendingUp, CalendarDays, DollarSign, Send } from "lucide-react";

export default function BottomNavBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center  z-40">
      <div className="relative overflow-hidden  w-[100%] max-w-md bg-[rgba(19,21,41,1)] backdrop-blur-3xl  rounded-t-xl shadow-lg flex justify-between items-center  text-gray-400">
        {/* Left icons */}
        <div className="flex p-3 mt-1 rounded-tl-xl mr-18 rounded-tr-3xl bg-[rgba(78,80,94,1)] /60 w-full items-center space-x-8">
          <a href="/charts" className="w-full">
            <TrendingUp
              size={22}
              className="cursor-pointer w-full hover:text-white transition"
            />
          </a>
          <a href="/charts" className="w-full">
            <CalendarDays
              size={22}
              className="cursor-pointer w-full hover:text-white transition"
            />
          </a>
        </div>

        {/* Floating Home Button */}

        <span className="bg-[rgba(78,80,94,1)] absolute top-0 left-1/2 transform -translate-x-1/2 rounded-t-full h-19  w-18 "></span>
        <span className="bg-[rgba(19,21,41,1)] absolute -top-10 left-1/2 transform -translate-x-1/2 rounded-full h-19  w-18 "></span>

        {/* Right icons */}
        <div className="grid grid-cols-2 mt-1 -ml-[14px] rounded-tl-3xl rounded-tr-xl  items-center  p-3  bg-[rgba(78,80,94,1)] w-full space-x-8">
          <a href="/withdraw-request">
            <DollarSign
              size={22}
              className="cursor-pointer  w-full hover:text-white transition"
            />
          </a>
          <Send
            size={22}
            className="cursor-pointer  w-full hover:text-white transition"
          />
        </div>
      </div>
      <a
        href="/"
        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
      >
        <div className="bg-gradient-to-bl from-[#212b61] to-[#79049a] p-4 rounded-full shadow-xl  cursor-pointer hover:scale-105 transition">
          <Home size={22} className="text-white" />
        </div>
      </a>
    </div>
  );
}
