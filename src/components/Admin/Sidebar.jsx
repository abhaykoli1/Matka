import React, { useState } from "react";
import {
  Home,
  Users,
  Target,
  FileText,
  Wallet,
  Settings,
  Bell,
  Layers,
  UserCog,
  ChevronDown,
  QrCode,
  Star,
} from "lucide-react";
import { MdMoney } from "react-icons/md";
import { SiMarketo } from "react-icons/si";

const Sidebar = ({ open }) => {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} /> },
    {
      name: "User Management",
      link: "/admin/users",
      icon: <Users size={18} />,
    },

    {
      name: "QR Manager",
      link: "/admin/qr-manager",
      icon: <QrCode size={18} />,
    },
    {
      name: "Deposite Requests",
      link: "/admin/deposite-requests",
      icon: <MdMoney size={18} />,
    },
    {
      name: "Starline Management",
      link: "/admin/starline",
      icon: <Star size={18} />,
    },
    {
      name: "Market Management",
      link: "/admin/markets",
      icon: <SiMarketo size={18} />,
    },
    { name: "Declare Result", icon: <Target size={18} /> },
    { name: "Winning Prediction", icon: <FileText size={18} /> },
    // { name: "Report Management", icon: <Layers size={18} />, dropdown: true },
    { name: "Wallet Management", icon: <Wallet size={18} />, dropdown: true },
    // { name: "Games Management", icon: <Target size={18} />, dropdown: true },
    // { name: "Settings", icon: <Settings size={18} />, dropdown: true },
    // { name: "Notice Management", icon: <Bell size={18} />, dropdown: true },
    // { name: "Galidesawar", icon: <Layers size={18} />, dropdown: true },
    // { name: "Sub Admin Management", icon: <UserCog size={18} /> },
  ];

  return (
    <div
      className={`fixed z-30 pt-16 left-0 top-0 h-full bg-[#0d1227] text-white transition-all duration-300 ${
        open ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <div className="flex flex-col h-full p-4 space-y-3">
        {menuItems.map((item, idx) => (
          <a
            href={item.link}
            key={idx}
            className="flex justify-between items-center text-sm hover:bg-[#2a3047] p-2 rounded-md cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.name}</span>
            </div>
            {item.dropdown && <ChevronDown size={14} />}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
