import React, { useState, useEffect } from "react";
import { Loader2, DollarSign, User2, History } from "lucide-react";
import { API_URL } from "../config";

const API_BASE_URL = API_URL; // Replace with your actual base URL

const getAuthToken = () => localStorage.getItem("accessToken");

// Utility function to get user ID from a basic JWT structure (header.payload.signature)
const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (token) {
    try {
      // Decode the payload (second part of the JWT)
      const payloadBase64 = token.split(".")[1];
      // atob is used for base64 decoding in the browser
      const decodedPayload = JSON.parse(atob(payloadBase64));
      // Assuming 'sub' (subject) or 'id' holds the user ID
      return decodedPayload.sub || decodedPayload.id || "User ID Not Found";
    } catch (e) {
      // console.error("Failed to decode token:", e);
      return "Not Logged In";
    }
  }
  return "Not Logged In";
};

export default function WithdrawRequest() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Paytm"); // Default method
  const [number, setNumber] = useState(""); // UPI/Payment number
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [minWithdraw, setMinWithdraw] = useState(200); // Example minimum
  const [currentUserId, setCurrentUserId] = useState(null);

  // --- Fetch Current Balance and User ID ---
  useEffect(() => {
    setCurrentUserId(getUserIdFromToken());

    const fetchBalance = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/user/balance`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentBalance(data.balance);
        }
      } catch (error) {
        // console.error("Balance fetch error:", error);
      }
    };
    fetchBalance();
  }, []);

  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = getAuthToken();

    if (!token) {
      setMessage({ type: "error", text: "Please log in to submit a request." });
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount <= minWithdraw) {
      setMessage({
        type: "error",
        text: `Minimum withdrawal is ₹${minWithdraw}.`,
      });
      return;
    }

    if (withdrawAmount > currentBalance) {
      setMessage({ type: "error", text: "Insufficient balance." });
      return;
    }

    setLoading(true);

    // Prepare form data for FastAPI endpoint (uses x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append("amount", withdrawAmount);
    formData.append("method", method);
    formData.append("number", number);

    try {
      const response = await fetch(`${API_BASE_URL}/withdraw/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded", // CRITICAL for FastAPI Form(...)
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            data.message +
            `. ID: ${data.withdrawal_id.substring(
              0,
              8
            )}... Your request is now pending review.`,
        });
        // Clear form fields after successful submission
        setAmount("");
        setNumber("");
        // Optimistically update balance
        setCurrentBalance((cb) => cb - withdrawAmount);
      } else {
        const errorText =
          data.detail || "Request failed. Check balance and withdrawal limits.";
        setMessage({ type: "error", text: errorText });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Could not connect to server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = ["Paytm", "Google Pay", "PhonePe", "Bank Transfer"];

  return (
    <div className="max-w-md mx-auto  font-sans text-white">
      <h2 className="text-xl justify-between font-bold border-b border-gray-700 bg-gradient-to-b from-black to-black/0 px-4 py-2 mb-3 flex items-center gap-2">
        <span className="flex gap-2">
          {" "}
          <DollarSign className="text-green-400" />
          Withdraw Funds
        </span>
        <a href="/withdraw-history">
          <History />
        </a>
      </h2>

      {/* Balance Info */}
      <div className="bg-white/10 p-4 mx-3 rounded-lg mb-4 shadow-md">
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <User2 size={16} /> User ID:{" "}
          <span className="font-mono text-xs text-purple-300">
            {currentUserId}
          </span>
        </p>
        <p className="text-sm text-gray-300 mt-2">Your Current Balance:</p>
        <p className="text-3xl font-extrabold text-green-400">
          ₹{currentBalance !== null ? currentBalance.toFixed(2) : "..."}
        </p>
        <p className="text-xs mt-1 text-gray-400">
          Minimum Withdrawal: ₹{minWithdraw}
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm mb-4 ${
            message.type === "success"
              ? "bg-green-600/20 text-green-300"
              : "bg-red-600/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Withdrawal Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mx-3 bg-white/10 p-6 rounded-xl shadow-2xl"
      >
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            placeholder={`Min ₹${minWithdraw}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
            min={minWithdraw}
            disabled={loading}
          />
        </div>

        {/* Payment Method Selection */}
        <div>
          <label htmlFor="method" className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
            disabled={loading}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m} className="bg-gray-800">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Number/ID Input */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium mb-1">
            {method} Number / UPI ID
          </label>
          <input
            type="text"
            id="number"
            placeholder={`Enter your ${method} number or UPI ID`}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
            required
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading ||
            amount <= minWithdraw ||
            amount > currentBalance ||
            !number
          }
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Withdrawal Request"
          )}
        </button>
      </form>
    </div>
  );
}
