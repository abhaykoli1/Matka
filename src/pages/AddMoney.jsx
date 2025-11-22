import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Copy,
  MessageCircle,
  Loader2,
  DollarSign,
  History,
} from "lucide-react";
import AddMoneyQrTab from "./Admin/Qr/AddMoneyQrTab";
import axios from "axios";
import DepositeByOwn from "./DepositeByOwn";
import { API_URL } from "../config";

const API_BASE_URL = API_URL; // Example: Replace with your actual base URL

// Placeholder for a generic UPI ID or payment instruction
const MERCHANT_UPI_ID = "your_merchant_upi_id@bank";

// NOTE: You must securely manage and retrieve the user's authentication token (e.g., from local storage or context)
// This function is still redundant, as you fetch the token directly in handleSubmit
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to generate the payment deep link based on method
const getPaymentUrl = (method, amount, txId) => {
  // NOTE: You MUST replace MERCHANT_UPI_ID with the actual, registered UPI ID
  // where the user should send money.
  const baseUri = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=Your Merchant Name&am=${amount}&cu=INR&tid=${txId}&mc=0000`;

  // The 'url' parameter is often used by mobile browsers to determine the preferred app
  switch (method.toLowerCase()) {
    case "paytm":
      return `${baseUri}&url=paytmmp://pay`;
    case "google pay":
      return `${baseUri}&url=tez://upi/pay`;
    case "phonepe":
      return `${baseUri}&url=phonepe://pay`;
    case "other":
    default:
      return baseUri;
  }
};

export default function AddMoney() {
  const [activeTab, setActiveTab] = useState("qr");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage({
        type: "error",
        text: "Authentication token missing. Please log in.",
      });
      return;
    }

    // Ensure amount is a positive number (minimum 200 based on QR tab instruction)
    if (amount < 200 || !method) {
      setMessage({
        type: "error",
        text: "Please enter a minimum amount of 200 and select a payment method.",
      });
      return;
    }

    setLoading(true);

    // 1. Prepare form data for FastAPI
    const formData = new URLSearchParams();
    formData.append("amount", amount);
    formData.append("payment_method", method);

    try {
      // 2. Call FastAPI to create the PENDING transaction record
      const response = await fetch(`${API_BASE_URL}/user/add-money`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        const txId = data.transaction_id;

        const paymentUrl = getPaymentUrl(method, amount, txId);

        setMessage({
          type: "success",
          text: `Transaction ${txId} created. Redirecting to ${method}...`,
        });

        window.location.href = paymentUrl;
      } else {
        const errorText = data.detail || "An unexpected error occurred.";
        setMessage({ type: "error", text: errorText });
      }
    } catch (error) {
      console.error("API Call Error:", error);
      setMessage({
        type: "error",
        text: "Network error or server unreachable.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amt) => {
    setAmount(amt);
  };

  const handleUpload = () => {
    alert(
      "Upload screenshot clicked! This would trigger a separate API for manual transaction verification."
    );
  };

  return (
    <div className="max-w-md  mx-auto flex flex-col items-center font-sans">
      <h2 className="text-xl w-full justify-between font-bold border-b border-gray-700 bg-gradient-to-b from-black to-black/0 px-4 py-2 mb-3 flex items-center gap-2">
        <span className="flex gap-2 text-lg items-center">
          <DollarSign size={20} className="text-green-400" />
          Add Points
        </span>
        <a href="/deposit-history">
          <History />
        </a>
      </h2>
      {/* Tabs */}
      {/* <div className="flex w-[93%] max-w-md mt-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("auto")}
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "auto"
              ? "text-[#79049a] border-b-2 border-[#79049a]"
              : "text-gray-500"
          }`}
        >
          PAY BY AUTO DEPOSIT
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "qr"
              ? "text-[#79049a] border-b-2 border-[#79049a]"
              : "text-gray-500"
          }`}
        >
          PAY BY QR CODE
        </button>
      </div> */}

      {/* API Response/Error Message Display */}
      {message && (
        <div
          className={`w-[93%] max-w-md p-3 mt-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* -------------------- AUTO DEPOSIT TAB -------------------- */}
      {activeTab === "auto" && <DepositeByOwn />}

      {/* -------------------- QR CODE TAB -------------------- */}
      {activeTab === "qr" && <AddMoneyQrTab />}

      {/* Footer Note */}
      {activeTab === "auto" && (
        <div className="mt-6 w-[93%] pb-10 max-w-md text-sm text-gray-200 leading-6">
          <p className="flex items-start gap-2">
            👉 अगर आपका पैसा कट गया है और अमाउंट ऐड नहीं हुआ है तो एडमिन को
            व्हाट्सएप पर पेमेंट स्क्रीनशॉट सेंड करें।
          </p>
          <p className="flex items-start gap-2 mt-2">
            👉 If your money has been deducted and the amount has not been
            added, then send the payment screenshot to the admin on WhatsApp.
            <MessageCircle
              size={18}
              className="text-green-600 inline ml-1 cursor-pointer"
            />
          </p>
        </div>
      )}
    </div>
  );
}
