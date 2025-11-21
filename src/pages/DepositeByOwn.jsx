import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/user`;

const getToken = () => localStorage.getItem("accessToken");

export default function DepositeByOwn() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  // QUICK AMOUNT BUTTON
  const handleQuickAmount = (amt) => {
    setAmount(amt);
  };

  // SUBMIT HANDLER — CALLS FastAPI /user/add-money
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) < 200) {
      alert("Minimum amount is 200");
      return;
    }

    if (!method) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("payment_method", method);

    try {
      const res = await axios.post(`${API_BASE}/add-money`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      alert("Request Created! Transaction ID: " + res.data.transaction_id);

      // reset form
      setAmount("");
      setMethod("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Failed to submit request");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[93%] mx-auto max-w-md bg-white/20 rounded-2xl shadow-lg p-4 mt-4"
      id="add-money-form"
    >
      <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

      <input
        type="number"
        placeholder="Add amount (Min 200)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border border-gray-200 focus:ring-2 focus:ring-purple-700 outline-none mb-3"
        disabled={loading}
      />

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[300, 500, 1000, 2000, 5000].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => handleQuickAmount(amt)}
            className="bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {amt}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {["Paytm", "Google Pay", "PhonePe", "Other"].map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer disabled:opacity-50"
          >
            <input
              type="radio"
              name="method"
              value={option}
              checked={method === option}
              onChange={(e) => setMethod(e.target.value)}
              className="accent-[#79049a]"
              disabled={loading}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition flex items-center justify-center disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed"
        )}
      </button>
    </form>
  );
}
