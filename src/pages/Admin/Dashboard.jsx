import React, { useState } from "react";

import { User, Tag } from "lucide-react";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import DashboardCard from "../../components/Admin/DashboardCard";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
  ];

  return (
    <div className="flex   min-h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-4 space-y-4 z-10">
          {/* Welcome Banner */}
          <div className="bg-blue-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-blue-700 font-semibold text-lg">
                Welcome Back!
              </h3>
              <p className="text-gray-600 text-sm">Admin Dashboard</p>
            </div>
            <img
              src="/admin-desk.svg"
              alt="Dashboard Illustration"
              className="w-24"
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard
              title="Users"
              value="600"
              subtext="Approved Users"
              color={colors[0]}
              icon={<User size={18} />}
            />
            <DashboardCard
              title="Today Registration"
              value="1"
              color={colors[2]}
              icon={<Tag size={18} />}
            />
            <DashboardCard
              title="Players (Today)"
              value="1"
              color={colors[1]}
              icon={<Tag size={18} />}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-700 mb-3">
              Total Bids On Single Ank Of Date 09 Nov 2025
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600">Game Name</label>
                <select className="w-full border rounded-md p-2 text-sm text-gray-700">
                  <option>-Select Game Name-</option>
                  <option>DESAWAR</option>
                  <option>FARIDABAD</option>
                  <option>GHAZIABAD</option>
                  <option>GALI</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Market Time</label>
                <select className="w-full border rounded-md p-2 text-sm text-gray-700">
                  <option>-Select Market Time-</option>
                  <option>Open Market</option>
                  <option>Close Market</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ank Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 text-center border-t-4"
                style={{ borderColor: colors[i % colors.length] }}
              >
                <p className="text-blue-600 font-semibold">Total Bids 0</p>
                <h2 className="text-2xl font-bold text-gray-800 my-2">0</h2>
                <p className="text-sm text-gray-600">Total Bid Amount</p>
                <p
                  className="mt-2 font-semibold"
                  style={{ color: colors[i % colors.length] }}
                >
                  Ank {i}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
