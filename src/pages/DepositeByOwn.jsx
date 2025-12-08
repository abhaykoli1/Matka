// // src/pages/DepositeByOwn.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2, Loader2Icon, MessageCircle } from "lucide-react";
// import { API_URL } from "../config";

// const API_BASE = `${API_URL}/user-deposit-withdrawal`;

// export default function DepositeByOwn({ onRequestCreated }) {
//   const [loading, setLoading] = useState(false);
//   const [amount, setAmount] = useState(() => {
//     return localStorage.getItem("add_amount") || "";
//   });

//   const [method, setMethod] = useState(() => {
//     return localStorage.getItem("add_method") || "Paytm";
//   });

//   useEffect(() => {
//     localStorage.setItem("add_amount", amount);
//   }, [amount]);

//   useEffect(() => {
//     localStorage.setItem("add_method", method);
//   }, [method]);

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

//       // await axios.post(`${API_BASE}/request`, formData, {
//       //   headers: {
//       //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       //   },
//       // });

//       // SLIDE notification + switch to QR
//       onRequestCreated();
//       setAmount("");
//       setMethod("");
//     } catch (err) {
//       // alert(err.response?.data?.detail || "Request failed");
//     }

//     setLoading(false);
//   };

//   const handleQuickAmount = (amt) => setAmount(amt);

//   const [siteData, setSiteData] = useState(null);
//   const [settings, setSettings] = useState(null);

//   useEffect(() => {
//     async function load() {
//       const res = await axios.get(`${API_URL}/settings/get`);

//       const sited = await axios.get(`${API_URL}/sitedata/get`);

//       console.log("siteed", sited);
//       setSiteData(sited?.data);
//       setSettings(res?.data);
//       if (error) {
//         console.log("Settings API Error:", error);
//       }
//     }

//     load();
//   }, []);
//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit}
//         className="w-[93%] mx-auto bg-white/5 rounded-xl p-4 mt-4"
//       >
//         <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

//         <input
//           type="number"
//           placeholder={`Add amount (Min Rs ${settings?.min_deposit})`}
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border
//           border-gray-50/15 focus:ring focus:ring-[#b00fdc] outline-none mb-3"
//         />

//         <div className="grid grid-cols-3 gap-3 mb-4">
//           {[300, 500, 1000, 2000, 5000].map((amt) => (
//             <button
//               key={amt}
//               type="button"
//               onClick={() => handleQuickAmount(amt)}
//               className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold
//               hover:bg-purple-800 transition"
//             >
//               {amt}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-2 mb-4">
//           {["Paytm", "Google Pay", "PhonePe"].map((option) => (
//             <label
//               key={option}
//               className="flex items-center gap-2 text-sm text-gray-200"
//             >
//               <input
//                 type="radio"
//                 name="method"
//                 value={option}
//                 checked={method === option}
//                 onChange={(e) => setMethod(e.target.value)}
//                 className="accent-[#79049a]"
//               />
//               {option}
//             </label>
//           ))}
//         </div>

//         <button
//           disabled={
//             loading || !settings?.min_deposit || amount < settings?.min_deposit
//           }
//           className={`w-full bg-gradient-to-tl
//   from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg
//   flex items-center justify-center transition
//   ${
//     loading || !settings?.min_deposit || amount < settings?.min_deposit
//       ? "opacity-50 cursor-not-allowed"
//       : "hover:bg-purple-800"
//   }`}
//         >
//           {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
//         </button>
//       </form>

//       {siteData?.add_money_html ? (
//         <div
//           className="text-gray-200 mt-4 mx-5 text-sm"
//           dangerouslySetInnerHTML={{
//             __html: siteData?.add_money_html,
//           }}
//         />
//       ) : (
//         <div className="mt-4 mx-5   max-w-md text-sm text-gray-200 leading-6">
//           <p className="flex items-start gap-2">
//             👉 अगर आपका पैसा कट गया है और अमाउंट ऐड नहीं हुआ है तो एडमिन को
//             व्हाट्सएप पर पेमेंट स्क्रीनशॉट सेंड करें।
//           </p>
//           <p className="flex items-start gap-2 mt-2">
//             👉 If your money has been deducted and the amount has not been
//             added, then send the payment screenshot to the admin on WhatsApp.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// / src/pages/DepositeByOwn.jsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2Icon } from "lucide-react";
// import { API_URL } from "../config";

// const API_BASE = `${API_URL}/user-deposit-withdrawal`;

// export default function DepositeByOwn({ onRequestCreated }) {
//   const [loading, setLoading] = useState(false);
//   const [siteData, setSiteData] = useState(null);
//   const [settings, setSettings] = useState(null);
//   const [amount, setAmount] = useState(() => {
//     return localStorage.getItem("add_amount") || "";
//   });

//   const [method, setMethod] = useState(() => {
//     return localStorage.getItem("add_method") || "PhonePe";
//   });

//   useEffect(() => {
//     localStorage.setItem("add_amount", amount);
//   }, [amount]);

//   useEffect(() => {
//     localStorage.setItem("add_method", method);
//   }, [method]);

//   // ⭐ YOUR UPI PAYMENT DATA ⭐
//   const UPI_ID = "hdml61i74205@hdfcbank";
//   const NAME = "Abhay Prakash Koli";
//   const NOTE = "Paying to Kalyan Ratan 777";

//   // ⭐ DIFFERENT UPI LINKS FOR EACH APP ⭐
//   const upiLinks = {
//     PhonePe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,

//     "Google Pay": `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,

//     Paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!amount || Number(amount) < settings?.min_deposit) {
//       alert(`Minimum deposit is Rs ${settings?.min_deposit}`);
//       return;
//     }

//     if (!method) {
//       alert("Please select a payment method");
//       return;
//     }

//     setLoading(true);

//     try {
//       const link = upiLinks[method];
//       if (link) {
//         window.location.href = link; // OPEN SELECTED APP
//       }

//       onRequestCreated();
//       setAmount("");
//       setMethod("");
//     } catch (err) {
//       console.log("Error", err);
//     }

//     setLoading(false);
//   };

//   const handleQuickAmount = (amt) => setAmount(amt);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get(`${API_URL}/settings/get`);
//         const sited = await axios.get(`${API_URL}/sitedata/get`);
//         setSiteData(sited?.data);
//         setSettings(res?.data);
//       } catch (error) {
//         console.log("Settings API Error:", error);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit}
//         className="w-[93%] mx-auto bg-white/5 rounded-xl p-4 mt-4"
//       >
//         <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

//         <input
//           type="number"
//           placeholder={`Add amount (Min Rs ${settings?.min_deposit})`}
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border
//           border-gray-50/15 focus:ring focus:ring-[#b00fdc] outline-none mb-3"
//         />

//         <div className="grid grid-cols-3 gap-3 mb-4">
//           {[300, 500, 1000, 2000, 5000].map((amt) => (
//             <button
//               key={amt}
//               type="button"
//               onClick={() => handleQuickAmount(amt)}
//               className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold
//               hover:bg-purple-800 transition"
//             >
//               {amt}
//             </button>
//           ))}
//         </div>

//         {/* PAYMENT METHODS */}
//         <div className="space-y-2 mb-4">
//           {["PhonePe", "Google Pay", "Paytm"].map((option) => (
//             <label
//               key={option}
//               className="flex items-center gap-2 text-sm text-gray-200"
//             >
//               <input
//                 type="radio"
//                 name="method"
//                 value={option}
//                 checked={method === option}
//                 onChange={(e) => setMethod(e.target.value)}
//                 className="accent-[#79049a]"
//               />
//               {option}
//             </label>
//           ))}
//         </div>

//         <button
//           disabled={
//             loading || !settings?.min_deposit || amount < settings?.min_deposit
//           }
//           className={`w-full bg-gradient-to-tl
//   from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg
//   flex items-center justify-center transition
//   ${
//     loading || !settings?.min_deposit || amount < settings?.min_deposit
//       ? "opacity-50 cursor-not-allowed"
//       : "hover:bg-purple-800"
//   }`}
//         >
//           {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
//         </button>
//       </form>

//       {/* Additional HTML */}
//       {siteData?.add_money_html ? (
//         <div
//           className="text-gray-200 mt-4 mx-5 text-sm"
//           dangerouslySetInnerHTML={{
//             __html: siteData?.add_money_html,
//           }}
//         />
//       ) : (
//         <div className="mt-4 mx-5   max-w-md text-sm text-gray-200 leading-6">
//           <p className="flex items-start gap-2">
//             👉 अगर आपका पैसा कट गया है और अमाउंट ऐड नहीं हुआ है तो एडमिन को
//             व्हाट्सएप पर पेमेंट स्क्रीनशॉट सेंड करें।
//           </p>
//           <p className="flex items-start gap-2 mt-2">
//             👉 If your money has been deducted and the amount has not been
//             added, then send the payment screenshot to the admin on WhatsApp.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

//
//
//
//
//
//
//
//
//

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2Icon, X } from "lucide-react";
// import { API_URL } from "../config";

// const API_BASE = `${API_URL}/user-deposit-withdrawal`;

// export default function DepositeByOwn({ onRequestCreated }) {
//   const [loading, setLoading] = useState(false);
//   const [siteData, setSiteData] = useState(null);
//   const [settings, setSettings] = useState(null);
//   const [amount, setAmount] = useState(() => {
//     return localStorage.getItem("add_amount") || "";
//   });

//   const [method, setMethod] = useState(() => {
//     return localStorage.getItem("add_method") || "PhonePe";
//   });

//   // ⭐ Popup UI State
//   const [popup, setPopup] = useState({ show: false, type: "", message: "" });

//   const showPopup = (type, message) => {
//     setPopup({ show: true, type, message });
//     setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
//   };

//   useEffect(() => {
//     localStorage.setItem("add_amount", amount);
//   }, [amount]);

//   useEffect(() => {
//     localStorage.setItem("add_method", method);
//   }, [method]);

//   // YOUR UPI PAYMENT DETAILS
//   const UPI_ID = "hdml61i74205@hdfcbank";
//   const NAME = "Abhay Prakash Koli";
//   const NOTE = "Paying to Kalyan Ratan 777";

//   // APP-SPECIFIC UPI LINKS
//   const upiLinks = {
//     PhonePe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,

//     "Google Pay": `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,

//     Paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
//       NAME
//     )}&tn=${encodeURIComponent(NOTE)}&am=${amount}&cu=INR`,
//   };

//   // HANDLE SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!amount || Number(amount) < settings?.min_deposit) {
//       showPopup("error", `Minimum deposit is Rs ${settings?.min_deposit}`);
//       return;
//     }

//     if (!method) {
//       showPopup("error", "Please select a payment method");
//       return;
//     }

//     setLoading(true);

//     try {
//       const link = upiLinks[method];

//       if (link) {
//         localStorage.setItem("upi_start_time", Date.now());
//         window.location.href = link; // Redirect to app
//       }

//       onRequestCreated();
//       setAmount("");
//       setMethod("");
//     } catch (err) {
//       console.log("Error", err);
//       showPopup("error", "Something went wrong!");
//     }

//     setLoading(false);
//   };

//   const handleQuickAmount = (amt) => setAmount(amt);

//   // LOAD SETTINGS
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get(`${API_URL}/settings/get`);
//         const sited = await axios.get(`${API_URL}/sitedata/get`);
//         setSiteData(sited?.data);
//         setSettings(res?.data);
//       } catch (error) {
//         console.log("Settings API Error:", error);
//       }
//     }
//     load();
//   }, []);

//   // ⭐ DETECT RETURN FROM APP & SHOW POPUP ⭐
//   useEffect(() => {
//     const start = localStorage.getItem("upi_start_time");
//     if (!start) return;

//     const diff = (Date.now() - Number(start)) / 1000;

//     if (diff < 2) {
//       showPopup("error", "❌ Payment failed or cancelled");
//     } else {
//       showPopup("success", "✅ Payment Successful! Wait for admin approval.");
//     }

//     localStorage.removeItem("upi_start_time");
//   }, []);

//   return (
//     <div className="w-full">
//       {/* ⭐ POPUP MESSAGE BOX ⭐ */}
//       {popup.show && (
//         <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[350px]">
//           <div
//             className={`p-4 rounded-xl shadow-xl text-white flex justify-between items-center animate-fade
//               ${
//                 popup.type === "success"
//                   ? "bg-green-600/90 border border-green-400/30"
//                   : "bg-red-600/90 border border-red-400/30"
//               }`}
//           >
//             <p>{popup.message}</p>
//             <button onClick={() => setPopup({ show: false })}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="w-[93%] mx-auto bg-white/5 rounded-xl p-4 mt-4"
//       >
//         <h2 className="text-sm font-semibold text-gray-200 mb-2">ADD POINTS</h2>

//         <input
//           type="number"
//           placeholder={`Add amount (Min Rs ${settings?.min_deposit})`}
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full bg-transparent text-gray-200 py-2 px-4 rounded-md border
//           border-gray-50/15 focus:ring focus:ring-[#b00fdc] outline-none mb-3"
//         />

//         <div className="grid grid-cols-3 gap-3 mb-4">
//           {[300, 500, 1000, 2000, 5000].map((amt) => (
//             <button
//               key={amt}
//               type="button"
//               onClick={() => handleQuickAmount(amt)}
//               className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold
//               hover:bg-purple-800 transition"
//             >
//               {amt}
//             </button>
//           ))}
//         </div>

//         {/* PAYMENT METHODS */}
//         <div className="space-y-2 mb-4">
//           {["PhonePe", "Google Pay", "Paytm"].map((option) => (
//             <label
//               key={option}
//               className="flex items-center gap-2 text-sm text-gray-200"
//             >
//               <input
//                 type="radio"
//                 name="method"
//                 value={option}
//                 checked={method === option}
//                 onChange={(e) => setMethod(e.target.value)}
//                 className="accent-[#79049a]"
//               />
//               {option}
//             </label>
//           ))}
//         </div>

//         <button
//           disabled={
//             loading || !settings?.min_deposit || amount < settings?.min_deposit
//           }
//           className={`w-full bg-gradient-to-tl
//   from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg
//   flex items-center justify-center transition
//   ${
//     loading || !settings?.min_deposit || amount < settings?.min_deposit
//       ? "opacity-50 cursor-not-allowed"
//       : "hover:bg-purple-800"
//   }`}
//         >
//           {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
//         </button>
//       </form>

//       {/* Additional HTML */}
//       {siteData?.add_money_html ? (
//         <div
//           className="text-gray-200 mt-4 mx-5 text-sm"
//           dangerouslySetInnerHTML={{
//             __html: siteData?.add_money_html,
//           }}
//         />
//       ) : (
//         <div className="mt-4 mx-5 max-w-md text-sm text-gray-200 leading-6">
//           <p className="flex items-start gap-2">
//             👉 अगर पैसा कट गया है लेकिन अमाउंट ऐड नहीं हुआ है तो एडमिन को
//             WhatsApp पर स्क्रीनशॉट भेजें।
//           </p>
//           <p className="flex items-start gap-2 mt-2">
//             👉 If money is deducted but amount not added, send payment
//             screenshot to admin.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2Icon, X } from "lucide-react";
import { API_URL } from "../config";

export default function DepositeByOwn({ onRequestCreated }) {
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState(
    () => localStorage.getItem("add_amount") || ""
  );

  const [method, setMethod] = useState(
    () => localStorage.getItem("add_method") || "PhonePe"
  );

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const sendSmsWebhook = async () => {
    try {
      const user_id = localStorage.getItem("userId");
      const res = await axios.post(`https://${API_URL}/user-deposit-deeplink/payment/sms-webhook`, {
        userId: `${user_id}`,
      });

      console.log("Response:", res.data);
    } catch (err) {
      alert("Some Thin went wrong!");
    }
  };
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false }), 3000);
  };

  useEffect(() => {
    localStorage.setItem("add_amount", amount);
  }, [amount]);

  useEffect(() => {
    localStorage.setItem("add_method", method);
  }, [method]);
  useEffect(() => {
    // Bridge connect karna zaruri hai
    window.UPI = {
      postMessage: (url) => {
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler("UPI", url);
        } else {
          alert("Flutter bridge missing!");
        }
      },
    };

    // Callback for Flutter → React
    window.onUpiResponse = (res) => {
      if(!res) return;
      if(res.includes("success")) {

        sendSmsWebhook();
      }
      console.log("UPI Response:", res);
      alert("Payment Status: " + res);
    };
  }, []);
 

  const startUpiPayment = ({url}) => {
    const upiUrl =
      "upi://pay?pa=2977654a@bandhan&pn=Abhay%20Prakash%20Koli&am=1&cu=INR&tn=TestPayment&tr=TXN001";
    window.UPI.postMessage(url);
  };
  // PAYMENT BUTTON CLICK
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) < settings?.min_deposit) {
      showPopup("error", `Minimum deposit is Rs ${settings?.min_deposit}`);
      return;
    }

    setLoading(true);

    try {
      const user_id = localStorage.getItem("userId");

      // ⭐ CALL YOUR FASTAPI BACKEND HERE ⭐
      const res = await axios.post(
        `${API_URL}/user-deposit-deeplink/payment/create`,
        {
          user_id: user_id,
          amount: parseFloat(amount),
        }
      );

      console.log(res);
      const { txn_id, upi_link } = res.data;

      // Save timestamp before redirect
      localStorage.setItem("upi_start_time", Date.now());
      localStorage.setItem("upi_txn", txn_id);

      // Redirect to backend deep link
      // window.location.href = upi_link;
      startUpiPayment(upi_link);
      // payUPI(upi_link);

      // onRequestCreated();
      setAmount("");
    } catch (error) {
      console.log(error);
      showPopup("error", "Something went wrong!");
    }
    setLoading(false);
  };

  // DETECT RETURN FROM PHONEPE / PAYTM / GPAY
  // useEffect(() => {
  //   const start = localStorage.getItem("upi_start_time");
  //   if (!start) return;

  //   const diff = (Date.now() - Number(start)) / 1000;

  //   if (diff < 2) {
  //     showPopup("error", "❌ Payment Failed or Cancelled");
  //   } else {
  //     showPopup("success", "✅ Payment Successful! Wait for admin approval.");
  //   }
  //   localStorage.removeItem("upi_start_time");
  //   localStorage.removeItem("upi_txn");
  // }, []);

  // Load settings
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API_URL}/settings/get`);
        const sited = await axios.get(`${API_URL}/sitedata/get`);
        setSiteData(sited?.data);
        setSettings(res?.data);
      } catch (error) {
        console.log("Settings API Error:", error);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full">
      {/* POPUP UI */}
      {/* {popup.show && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[350px]">
          <div
            className={`p-4 rounded-xl shadow-xl text-white flex justify-between items-center 
              ${popup.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            <p>{popup.message}</p>
            <button onClick={() => setPopup({ show: false })}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )} */}

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
              onClick={() => setAmount(amt)}
              className="border border-gray-50/15 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              {amt}
            </button>
          ))}
        </div>

        <button
          disabled={
            loading || !settings?.min_deposit || amount < settings?.min_deposit
          }
          className={`w-full bg-gradient-to-tl
            from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg flex items-center justify-center transition
            ${loading || amount < settings?.min_deposit
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-800"
            }`}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Proceed"}
        </button>
      </form>
    </div>
  );
}
