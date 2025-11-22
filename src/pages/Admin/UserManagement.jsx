import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, PhoneCall } from "lucide-react";
import { API_URL } from "../../config";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((u) => ({
        id: u.user_id,
        username: u.username,
        mobile: u.mobile,
        role: u.role,
        date: new Date(u.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      setUsers(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div className="p-4  min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">USER LIST</h2>
      </div>

      {/* Search Box */}
      <div className="bg-white/5 rounded-xl p-4 mb-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Search By Name or Mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border bg-black/30 text-white border-gray-600 rounded-md px-3 py-2 w-full sm:w-1/3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="border-2 px-3 py-2 text-sm rounded-md flex items-center gap-2">
            <Search size={16} />
            <span className="hidden sm:flex">Submit</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-xl shadow backdrop-blur overflow-x-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead>
            <tr className="bg-white/10 text-gray-300 border-b border-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
              {/* <th className="p-3 text-center">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-700 hover:bg-white/10 transition"
                >
                  <td className="p-3 text-blue-400 font-medium">
                    {u.username}
                  </td>

                  <td className="p-3 flex items-center gap-2">
                    <a
                      href={`https://wa.me/91${u.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 underline"
                    >
                      {u.mobile}
                    </a>
                    <PhoneCall size={16} className="text-green-500" />
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        u.role === "admin"
                          ? "bg-red-600/40 text-red-300 border border-red-500"
                          : "bg-blue-600/40 text-blue-300 border border-blue-500"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">{u.date}</td>

                  {/* <td className="p-3 text-center">
                    <button className="text-blue-400 hover:text-blue-500">
                      <Eye size={18} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
