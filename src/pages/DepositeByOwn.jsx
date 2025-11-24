// // src/pages/DepositeByOwn.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { API_URL } from "../config";

// const API_BASE = `${API_URL}/user-deposit-withdrawal`;

// export default function DepositeByOwn() {
//   const [amount, setAmount] = useState("");
//   const [method, setMethod] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleQuickAmount = (amt) => {
//     setAmount(amt);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!amount || Number(amount) < 200) {
//       alert("Minimum amount is 200");
//       return;
//     }

//     if (!method) {
//       alert("Please select a payment method");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("amount", amount);
//       formData.append("method", method);
//       formData.append("number", "N/A");

//       const res = await axios.post(`${API_BASE}/request`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       alert("Withdrawal Request Created!");
//       setAmount("");
//       setMethod("");
//     } catch (err) {
//       alert(err.response?.data?.detail || "Request failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-[93%] mx-auto max-w-md bg-white/5 rounded-xl shadow-lg p-4 mt-4"
//     >
//       <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

//       <input
//         type="number"
//         placeholder="Add amount (Min 200)"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border border-gray-50/15 focus:ring focus:ring-[#b00fdc] outline-none mb-3"
//         disabled={loading}
//       />

//       <div className="grid grid-cols-3 gap-3 mb-4">
//         {[300, 500, 1000, 2000, 5000].map((amt) => (
//           <button
//             key={amt}
//             type="button"
//             onClick={() => handleQuickAmount(amt)}
//             className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
//             disabled={loading}
//           >
//             {amt}
//           </button>
//         ))}
//       </div>

//       <div className="space-y-2 mb-4">
//         {["Paytm", "Google Pay", "PhonePe", "Other"].map((option) => (
//           <label
//             key={option}
//             className="flex items-center gap-2 text-sm text-gray-200"
//           >
//             <input
//               type="radio"
//               name="method"
//               value={option}
//               checked={method === option}
//               onChange={(e) => setMethod(e.target.value)}
//               className="accent-[#79049a]"
//             />
//             {option}
//           </label>
//         ))}
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition flex items-center justify-center"
//       >
//         {loading ? <Loader2 className="animate-spin" /> : "Proceed"}
//       </button>
//     </form>
//   );
// }

// src/pages/DepositeByOwn.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Loader2Icon } from "lucide-react";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/user-deposit-withdrawal`;

export default function DepositeByOwn({ onRequestCreated }) {
  const [amount, setAmount] = useState(() => {
    return localStorage.getItem("add_amount") || "";
  });

  const [method, setMethod] = useState(() => {
    return localStorage.getItem("add_method") || "";
  });

  useEffect(() => {
    localStorage.setItem("add_amount", amount);
  }, [amount]);

  useEffect(() => {
    localStorage.setItem("add_method", method);
  }, [method]);

  const [loading, setLoading] = useState(false);
  console.log(amount, method);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[93%] mx-auto bg-white/5 rounded-xl p-4 mt-4"
    >
      <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

      <input
        type="number"
        placeholder="Add amount (Min 200)"
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
        {["Paytm", "Google Pay", "PhonePe", "Other"].map((option) => (
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
        className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white
        font-semibold py-2 rounded-full hover:bg-purple-800 transition flex items-center justify-center"
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
      </button>
    </form>
  );
}
