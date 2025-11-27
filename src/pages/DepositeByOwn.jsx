// src/pages/DepositeByOwn.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Loader2Icon, MessageCircle } from "lucide-react";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/user-deposit-withdrawal`;

export default function DepositeByOwn({ onRequestCreated }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(() => {
    return localStorage.getItem("add_amount") || "";
  });

  const [method, setMethod] = useState(() => {
    return localStorage.getItem("add_method") || "Paytm";
  });

  useEffect(() => {
    localStorage.setItem("add_amount", amount);
  }, [amount]);

  useEffect(() => {
    localStorage.setItem("add_method", method);
  }, [method]);

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

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("method", method);
      formData.append("number", "N/A");

      // await axios.post(`${API_BASE}/request`, formData, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //   },
      // });

      // SLIDE notification + switch to QR
      onRequestCreated();
      setAmount("");
      setMethod("");
    } catch (err) {
      // alert(err.response?.data?.detail || "Request failed");
    }

    setLoading(false);
  };

  const handleQuickAmount = (amt) => setAmount(amt);

  const [siteData, setSiteData] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${API_URL}/settings/get`);

      const sited = await axios.get(`${API_URL}/sitedata/get`);

      console.log("siteed", sited);
      setSiteData(sited?.data);
      setSettings(res?.data);
      if (error) {
        console.log("Settings API Error:", error);
      }
    }

    load();
  }, []);
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-[93%] mx-auto bg-white/5 rounded-xl p-4 mt-4"
      >
        <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

        <input
          type="number"
          placeholder={`Add amount (Min Rs ${settings?.min_deposit})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border
          border-gray-50/15 focus:ring focus:ring-[#b00fdc] outline-none mb-3"
        />

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[300, 500, 1000, 2000, 5000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAmount(amt)}
              className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold
              hover:bg-purple-800 transition"
            >
              {amt}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          {["Paytm", "Google Pay", "PhonePe"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-sm text-gray-200"
            >
              <input
                type="radio"
                name="method"
                value={option}
                checked={method === option}
                onChange={(e) => setMethod(e.target.value)}
                className="accent-[#79049a]"
              />
              {option}
            </label>
          ))}
        </div>

        <button
          disabled={
            loading || !settings?.min_deposit || amount < settings?.min_deposit
          }
          className={`w-full bg-gradient-to-tl 
  from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg
  flex items-center justify-center transition
  ${
    loading || !settings?.min_deposit || amount < settings?.min_deposit
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-purple-800"
  }`}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
        </button>
      </form>

      {siteData?.add_money_html ? (
        <div
          className="text-gray-200 mt-4 mx-5 text-sm"
          dangerouslySetInnerHTML={{
            __html: siteData?.add_money_html,
          }}
        />
      ) : (
        <div className="mt-4 mx-5   max-w-md text-sm text-gray-200 leading-6">
          <p className="flex items-start gap-2">
            👉 अगर आपका पैसा कट गया है और अमाउंट ऐड नहीं हुआ है तो एडमिन को
            व्हाट्सएप पर पेमेंट स्क्रीनशॉट सेंड करें।
          </p>
          <p className="flex items-start gap-2 mt-2">
            👉 If your money has been deducted and the amount has not been
            added, then send the payment screenshot to the admin on WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
}
