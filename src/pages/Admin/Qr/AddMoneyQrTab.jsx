// src/pages/Admin/Qr/AddMoneyQrTab.jsx
import { Copy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

const API_BASE = `${API_URL}/user-deposit-withdrawal`;

const AddMoneyQrTab = ({ site }) => {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const [currentQR, setCurrentQR] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState(null);
  // console.log(settings);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${API_URL}/settings/get`);
      console.log("res", res);

      setSettings(res?.data);
      if (error) {
        console.log("Settings API Error:", error);
      }
    }

    load();
  }, []);

  // ------------------------------------------------------------
  // FETCH CURRENT QR FROM SERVER
  // ------------------------------------------------------------
  const fetchCurrentQR = async () => {
    try {
      const res = await axios.get(`${API_URL}/image/get`);

      if (res.data?.image_url) {
        setCurrentQR(
          `${API_URL}${res.data.image_url}?t=${new Date().getTime()}`
        );
      } else {
        setCurrentQR(null);
      }
    } catch (error) {
      console.log("QR FETCH ERROR:", error);
      setCurrentQR(null);
    }
  };

  useEffect(() => {
    fetchCurrentQR();
  }, []);

  // ------------------------------------------------------------
  // FILE PICKER
  // ------------------------------------------------------------
  const openPicker = () => fileInputRef.current?.click();

  const onSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setSelectedFile(f);
    setPreviewImage(URL.createObjectURL(f));
  };

  // ------------------------------------------------------------
  // UPLOAD SCREENSHOT
  // ------------------------------------------------------------
  const uploadNow = async () => {
    if (!selectedFile) return;

    const fd = new FormData();

    const amount = localStorage.getItem("add_amount") || "";
    const method = localStorage.getItem("add_method") || "";

    fd.append("image", selectedFile);
    fd.append("amount", amount);
    fd.append("method", method);

    try {
      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      // Clear values
      localStorage.removeItem("add_amount");
      localStorage.removeItem("add_method");

      setPreviewImage(null);
      setSelectedFile(null);

      setShowSuccess(true);
      fetchCurrentQR();

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  return (
    <div className="w-[93%] mx-auto max-w-md bg-white/5 rounded-xl p-4 mt-4">
      {/* -------------------- UPI COPY -------------------- */}
      <div className="w-full flex items-center justify-between border border-gray-50/15 rounded-md px-3 py-2 mb-4">
        <p className="text-white text-sm">{site?.upi_id}</p>

        <Copy
          size={18}
          className="text-gray-200 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(site?.upi_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>

      {/* -------------------- QR IMAGE -------------------- */}
      <img
        src={currentQR || "/assets/logo.png"}
        className="w-48 h-48 mx-auto my-4 rounded-lg shadow-lg"
        alt="UPI QR"
      />

      {/* -------------------- INFO -------------------- */}
      <div className="text-gray-200 text-sm leading-6 mb-6 text-center">
        <p>
          UPI पर पेमेंट करके एडमिन को WhatsApp{" "}
          <span className="font-bold text-purple-300">(+919509397414)</span> पर
          स्क्रीनशॉट भेजे।
        </p>
        <p className="mt-2 text-gray-300">
          Make payment via UPI and send screenshot to admin on WhatsApp.
        </p>

        <p className="mt-2 font-semibold text-green-300">
          Payment will be added within 2 minutes.
        </p>
        <p className="text-red-400 font-bold">
          Minimum Payment: ₹{settings?.min_deposit}
        </p>
      </div>

      {/* FILE PICKER */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onSelect}
        className="hidden"
      />

      <button
        onClick={openPicker}
        className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] 
               text-white font-semibold py-2 rounded-lg shadow-md"
      >
        Upload Payment Screenshot
      </button>

      {/* ---------------- SUCCESS POPUP ---------------- */}
      {showSuccess && (
        <div className="fixed bottom-40 left-1/2 text-sm font-medium  animate-fadeIn -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-full shadow-lg">
          Uploaded Successfully!
        </div>
      )}

      {/* ---------------- COPY POPUP ---------------- */}
      {copied && (
        <div className="fixed bottom-40 left-1/2 text-sm font-medium  animate-fadeIn -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full shadow-lg">
          Copied!
        </div>
      )}

      {/* ---------------- PREVIEW MODAL ---------------- */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl w-[320px] shadow-xl">
            <img src={previewImage} className="w-full rounded-lg mb-4" />

            <div className="flex gap-3">
              <button
                className="w-1/2 py-2 bg-red-500/40 text-white rounded-lg"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>

              <button
                className="w-1/2 py-2 bg-green-500/40 text-white rounded-lg"
                onClick={uploadNow}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoneyQrTab;
