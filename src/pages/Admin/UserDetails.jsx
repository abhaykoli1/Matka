import React from "react";
import { Phone, MessageCircle } from "lucide-react";

export default function UserDetails() {
  return (
    <div className="p-4 bg-[#f7f8fc] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-700">USER DETAILS</h2>
          <p className="text-sm text-gray-500">
            User Management /{" "}
            <span className="font-medium text-gray-700">User Details</span>
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-blue-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-700">Mohsin Sh</h3>
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <span>7020571058</span> <Phone size={14} />
          </div>
          <div className="text-green-600 mt-1 flex items-center gap-1">
            <MessageCircle size={14} /> WhatsApp
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-700 mt-4 sm:mt-0">
          <div>
            Active:{" "}
            <span className="bg-green-500 text-white px-3 py-[2px] rounded-full text-xs">
              Yes
            </span>
          </div>
          <div>
            Betting:{" "}
            <span className="bg-green-500 text-white px-3 py-[2px] rounded-full text-xs">
              Yes
            </span>
          </div>
          <div>
            Delete Account:{" "}
            <span className="bg-red-500 text-white px-3 py-[2px] rounded-full text-xs">
              Delete
            </span>
          </div>
          <div>
            Logout Status:{" "}
            <span className="bg-green-600 text-white px-3 py-[2px] rounded-full text-xs">
              Logout Now
            </span>
          </div>
        </div>
      </div>

      {/* Security & Balance */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="text-sm text-gray-500">Security Password</p>
            <p className="font-semibold text-gray-800">12345678</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
            Change
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="font-semibold text-gray-800 mb-4">5</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-green-600 text-white px-5 py-2 rounded-md text-sm">
              Add Money
            </button>
            <button className="bg-red-500 text-white px-5 py-2 rounded-md text-sm">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Full Name:</strong> Mohsin Sh
          </p>
          <p>
            <strong>Mobile:</strong> 7020571058
          </p>
          <p>
            <strong>Email:</strong> example@gmail.com
          </p>
          <p>
            <strong>Password:</strong> 12345678
          </p>
          <p>
            <strong>Creation Date:</strong> 09 Nov 2025 05:30:00
          </p>
          <p>
            <strong>Last Login:</strong> 09 Nov 2025 15:08:10
          </p>
        </div>

        {/* Deposit Summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs">
            Total Deposit
          </span>
          <span className="bg-red-500 text-white px-3 py-1 rounded-md text-xs">
            Total Withdraw 0
          </span>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">
            Total Bid
          </span>
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs">
            Total Winning
          </span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Payment Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <strong>Bank Name:</strong> SBI
          </p>
          <p>
            <strong>Branch Address:</strong> Pune
          </p>
          <p>
            <strong>A/c Holder Name:</strong> Mohsin
          </p>
          <p>
            <strong>A/c Number:</strong> 1234567890
          </p>
          <p>
            <strong>IFSC:</strong> SBIN000123
          </p>
          <p>
            <strong>PhonePe No.:</strong> 7020571058
          </p>
          <p>
            <strong>Google Pay No.:</strong> 7020571058
          </p>
        </div>
      </div>

      {/* Fund Tables */}
      {[
        "Fund Credit (Admin)",
        "Fund Debit (Admin)",
        "Add Fund Request (UPI)",
        "Withdraw Fund",
        "Bid History",
        "Winning History Report",
      ].map((title, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
          <div className="flex justify-between items-center mb-3 text-sm">
            <div>
              Show{" "}
              <select className="border rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>{" "}
              entries
            </div>
            <div>
              Search:{" "}
              <input
                type="text"
                className="border rounded px-2 py-1 text-sm outline-none"
              />
            </div>
          </div>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Request Amount</th>
                <th className="p-2 border">Remark</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {idx === 0 ? (
                <tr className="bg-green-100">
                  <td className="border p-2">1</td>
                  <td className="border p-2">5</td>
                  <td className="border p-2">Welcome Bonus</td>
                  <td className="border p-2">09 Nov 2025</td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 p-3 border"
                  >
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
            <p>
              Showing {idx === 0 ? "1 to 1" : "0 to 0"} of{" "}
              {idx === 0 ? "1" : "0"} entries
            </p>
            <div className="flex items-center gap-2">
              <button className="border rounded px-3 py-1 text-gray-600">
                Previous
              </button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                1
              </button>
              <button className="border rounded px-3 py-1 text-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
