import { Copy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const AddMoneyQrTab = () => {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const [currentQR, setCurrentQR] = useState(null);

  console.log(currentQR);
  useEffect(() => {
    fetchCurrentQR();
  }, []);

  const fetchCurrentQR = async () => {
    try {
      const res = await axios.get(`${API_BASE}/image/get`);
      // FIX: prevent browser cache
      setCurrentQR(
        API_BASE + res.data.image_url + "?t=" + new Date().getTime()
      );
    } catch (error) {
      setCurrentQR(null);
    }
  };

  // Open hidden file dialog
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Auto upload when user selects file
  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prepare formData
    const formData = new FormData();
    formData.append("image", file); // MUST match FastAPI parameter name

    try {
      await axios.post(`${API_BASE}/deposit-qr/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Screenshot uploaded successfully!");
    } catch (err) {
      alert("Upload failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="w-[93%] mx-auto mb-12 max-w-md bg-white/20 rounded-2xl shadow-lg p-5 mt-4 flex flex-col items-center">
        {/* UPI ID */}
        <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 mb-4">
          <p className="text-white text-sm font-medium">3103781a@bandhan</p>
          <Copy size={16} className="text-gray-600 cursor-pointer" />
        </div>

        {/* QR Code */}
        <img
          src={currentQR ? currentQR : "../assets/logo.png"}
          alt="QR Code"
          className="w-48 h-48 my-4"
        />

        {/* Instructions */}
        <div className="text-gray-200 text-sm leading-6 mb-6 text-center">
          <p>
            upi id पर पेमेंट करके एडमिन को व्हाट्सएप{" "}
            <span className="font-semibold">(+919509397414)</span> पर स्क्रीनशॉट
            भेजे!
          </p>
          <p className="mt-2">
            Make payment on UPI and message screenshot to admin on WhatsApp!
          </p>
          <p className="mt-2 font-medium text-gray-200">
            Payment will be added within 2 minutes.
          </p>
          <p className="text-red-500 font-semibold">Pay Minimum 200 Rupees.</p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileSelected}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={openFilePicker}
          className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition"
        >
          Upload Screenshot
        </button>
      </div>
    </div>
  );
};

export default AddMoneyQrTab;
