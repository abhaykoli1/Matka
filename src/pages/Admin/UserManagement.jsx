import React, { useState } from "react";
import { Search, Eye, Download, PhoneCall } from "lucide-react";

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const users = [
    {
      name: "Mohsin Sh",
      mobile: "7020571058",
      date: "09 Nov 2025",
      balance: 5,
      bet: "Yes",
      status: "Yes",
    },
    {
      name: "Samjeet M",
      mobile: "8780917519",
      date: "08 Nov 2025",
      balance: 5,
      bet: "Yes",
      status: "Yes",
    },
    {
      name: "Rathod GH",
      mobile: "9723433902",
      date: "06 Nov 2025",
      balance: 5,
      bet: "Yes",
      status: "Yes",
    },
    {
      name: "Sarwar",
      mobile: "9579177118",
      date: "06 Nov 2025",
      balance: 5,
      bet: "Yes",
      status: "Yes",
    },
    {
      name: "Rahul",
      mobile: "6377626686",
      date: "04 Nov 2025",
      balance: 0,
      bet: "Yes",
      status: "Yes",
    },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-[#f7f8fc min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-200">USER LIST</h2>
        </div>
        {/* <button className="border text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 flex items-center gap-2">
          <Download size={16} />
          Download Excel
        </button> */}
      </div>

      {/* Search Section */}
      <div className="bg- rounded-xl shadow mb-6">
        <div className="flex flex-co sm: flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Search By Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border md: !w-full rounded-md px-3 py-2   sm:w-1/3 text-sm !outline-1 focus:ring-1 focus:ring-blue-500"
          />
          <button className="border-2 text-white px-2 py-2 text-sm rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Search size={16} />{" "}
            <span className="md:flex sm:flex hidden text-medium  text-md">
              Submit
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Balance</th>
              {/* <th className="p-3 text-center">Bet</th> */}
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="p-3 text-blue-600 font-medium cursor-pointer">
                  {user.name}
                </td>

                <td className="p-3 flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${user.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 underline"
                  >
                    {user.mobile}
                  </a>
                  <PhoneCall size={16} className="text-green-500" />
                </td>

                <td className="p-3">{user.date}</td>
                <td className="p-3">{user.balance}</td>

                {/* <td className="p-3 text-center">
                  <span className="px-3 py-1 text-xs border border-green-500 text-green-600 rounded-md">
                    {user.bet}
                  </span>
                </td> */}

                <td className="p-3 text-center">
                  <span className="px-3 py-1 text-xs border border-green-500 text-green-600 rounded-md">
                    {user.status}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
