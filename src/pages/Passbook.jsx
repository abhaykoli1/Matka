import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";

// Dummy implementation for the sake of completion.
// Replace with your actual authentication context or hook to get the API URL.
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Helper function to determine the color and icon for the transaction type/status
 * @param {string} type - The transaction type (e.g., DEPOSIT, WITHDRAWAL, BID, WIN)
 * @param {string} status - The transaction status (e.g., SUCCESS, PENDING, FAILED)
 * @returns {{color: string, icon: string}}
 */
const getStatusClasses = (type, status) => {
  if (type === "BID") {
    return { color: "text-red-600 bg-red-100", icon: "💸" }; // Debit
  }
  if (type === "WIN" || type === "DEPOSIT") {
    return { color: "text-green-600 bg-green-100", icon: "💰" }; // Credit/Success
  }

  // For Transactions/Withdrawals status
  switch (status) {
    case "SUCCESS":
      return { color: "text-green-600 bg-green-100", icon: "✅" };
    case "PENDING":
      return { color: "text-yellow-600 bg-yellow-100", icon: "⏳" };
    case "FAILED":
      return { color: "text-red-600 bg-red-100", icon: "❌" };
    default:
      return { color: "text-gray-600 bg-gray-100", icon: "ℹ️" };
  }
};

/**
 * Generates the main description for a passbook entry
 * @param {object} entry - The passbook entry object
 * @returns {string}
 */
const getEntryDescription = (entry) => {
  switch (entry.type) {
    case "DEPOSIT":
      return `Funds Deposited via ${entry.payment_method}`;
    case "WIN":
      return "Winnings Credited";
    case "WITHDRAWAL":
      return `Withdrawal Request via ${entry.method}`;
    case "BID":
      return `Bid Placed: ${entry.digit} on ${entry.market_id} (${entry.session})`;
    case "QR_DEPOSIT":
      return "QR Deposit Screenshot Uploaded";
    default:
      return "Transaction Detail";
  }
};

const Passbook = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  // For date filter, based on the screenshot, we'll use a simple filter button for "Last 7 Days"
  const [filterDays, setFilterDays] = useState(7);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: You'll need to handle the token/auth header for your API
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/passbook/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Failed to fetch passbook history:", err);
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter history based on the selected filterDays (Last 7 Days, Last 30 Days, All, etc.)
  const filteredHistory = useMemo(() => {
    if (filterDays === "all" || history.length === 0) {
      return history;
    }

    const cutoffDate = moment().subtract(filterDays, "days");

    return history.filter((entry) =>
      moment(entry.created_at).isSameOrAfter(cutoffDate, "day")
    );
  }, [history, filterDays]);

  const renderHistoryItem = (entry, index) => {
    const { color, icon } = getStatusClasses(entry.type, entry.status);
    const description = getEntryDescription(entry);

    // Determine Credit or Debit amount display
    let amountDisplay;
    let amountClass;

    if (entry.type === "BID") {
      // Bids are debit (negative)
      amountDisplay = `-${entry.debit}`;
      amountClass = "text-red-600 font-semibold";
    } else if (entry.type === "WIN" || entry.type === "DEPOSIT") {
      // Wins and Deposits are credit (positive)
      amountDisplay = `+${entry.amount.toFixed(2)}`;
      amountClass = "text-green-600 font-semibold";
    } else if (entry.type === "WITHDRAWAL" && entry.status === "SUCCESS") {
      // Successful withdrawal is a debit
      amountDisplay = `-${entry.amount.toFixed(2)}`;
      amountClass = "text-red-600 font-semibold";
    } else if (entry.amount) {
      // Default for other transactions with an amount (e.g., Pending Withdrawal)
      amountDisplay = entry.amount.toFixed(2);
      amountClass = "text-gray-700 font-medium";
    } else {
      // For QR_DEPOSIT without amount or other types
      amountDisplay = "";
      amountClass = "text-gray-500";
    }

    return (
      <div
        key={index}
        className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
      >
        {/* Left Section: Icon, Description, and Date */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full ${color} flex items-center justify-center text-lg`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {description}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {moment(entry.created_at).format("DD-MMM-YYYY | hh:mm A")}
            </p>
          </div>
        </div>

        {/* Right Section: Amount and Status */}
        <div className="flex flex-col items-end">
          <p className={`text-base ${amountClass}`}>{amountDisplay}</p>
          <span
            className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${color}`}
          >
            {entry.status || entry.type}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
        💰 Passbook History
      </h1>

      {/* Date Range/Filter Section (Matching the screenshot's filter options) */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex space-x-2">
          {/* Basic date filter buttons */}
          {["7", "30", "all"].map((days) => (
            <button
              key={days}
              onClick={() =>
                setFilterDays(days === "all" ? "all" : parseInt(days))
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                filterDays === days ||
                (filterDays !== "all" && filterDays === parseInt(days))
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {days === "all" ? "All Time" : `Last ${days} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* History List/Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <svg
              className="animate-spin h-5 w-5 text-blue-500 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading history...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500">{error}</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No transactions found for the selected period.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredHistory.map(renderHistoryItem)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Passbook;
