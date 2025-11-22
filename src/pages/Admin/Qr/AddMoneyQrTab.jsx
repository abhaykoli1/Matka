import { Copy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

const API_BASE = API_URL;

const AddMoneyQrTab = () => {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const [currentQR, setCurrentQR] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // <-- NEW
  const [selectedFile, setSelectedFile] = useState(null); // <-- NEW

  useEffect(() => {
    fetchCurrentQR();
  }, []);

  const fetchCurrentQR = async () => {
    try {
      const res = await axios.get(`${API_BASE}/image/get`);
      setCurrentQR(
        API_BASE + res.data.image_url + "?t=" + new Date().getTime()
      );
    } catch (error) {
      setCurrentQR(null);
    }
  };

  // Open file dialog
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // When user selects file → show preview modal
  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file)); // <-- preview image
  };

  // Upload when user confirms
  const confirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(`${API_BASE}/deposit-qr/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res);
      setPreviewImage(null); // close preview
      setSelectedFile(null);
      setShowSuccess(true);
      fetchCurrentQR();
    } catch (err) {
      alert("Upload failed. Try again.");
      console.error(err);
    }
  };

  // Cancel preview
  const cancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  return (
    <div>
      {/* ====================== IMAGE PREVIEW MODAL ====================== */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-5 w-[320px] text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Preview Screenshot
            </h2>

            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-56 object-cover rounded-lg border mb-4"
            />

            <div className="flex justify-between gap-3">
              <button
                onClick={cancelPreview}
                className="w-1/2 py-2 bg-gray-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="w-1/2 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== SUCCESS MODAL ====================== */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-semibold text-green-600">
              Request Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Your screenshot has been uploaded.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ====================== MAIN UI ====================== */}
      <div className="w-[93%] mx-auto mb-12 max-w-md bg-white/20 rounded-2xl shadow-lg p-5 mt-4 flex flex-col items-center">
        {/* UPI ID */}
        <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 mb-4">
          <p className="text-white text-sm font-medium">3103781a@bandhan</p>
          <Copy size={16} className="text-gray-600 cursor-pointer" />
        </div>

        {/* QR CODE */}
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

        {/* File Input (hidden) */}
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
          className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white font-semibold py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Upload Screenshot
        </button>
      </div>
    </div>
  );
};

export default AddMoneyQrTab;
