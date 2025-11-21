import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // change for production

export default function AdminQRManager() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);
  
  const [currentQR, setCurrentQR] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/image/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("QR Code Updated Successfully!");
      setSelectedFile(null);
      setPreview(null);
      setReplaceMode(false);
      fetchCurrentQR(); // reload new QR
    } catch (error) {
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex maxw-md mx-auto justify-center flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">QR Code Manager</h2>
      <div className="w-full max-w-xl bg-white/20 shadow-lg rounded-lg p-6">
        {/* If QR Exists */}
        {currentQR && !replaceMode && (
          <>
            <h3 className="font-semibold mb-2">Current QR Code:</h3>

            <img
              src={currentQR}
              alt="Current QR"
              className="w-48 h-48 object-cover rounded border mx-auto mb-4"
            />

            <button
              className="w-full py-3 mt-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => setReplaceMode(true)}
            >
              Replace QR
            </button>
          </>
        )}

        {/* Upload or Replace Section */}
        {(!currentQR || replaceMode) && (
          <div className="flex flex-col items-center mt-6">
            <label className="w-full cursor-pointer">
              <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center hover:bg-gray-50">
                <p className="text-gray-700">Click to select a QR image</p>
                <p className="text-sm text-gray-400">PNG or JPG only</p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {preview && (
              <>
                <p className="mt-3 font-medium">Preview:</p>
                <img
                  src={preview}
                  className="w-48 h-48 object-cover rounded mt-2 border"
                  alt="Preview"
                />
              </>
            )}

            <button
              onClick={uploadImage}
              disabled={loading || !selectedFile}
              className={`mt-5 w-full py-3 rounded-lg text-white font-semibold ${
                loading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Uploading..." : currentQR ? "Update QR" : "Upload QR"}
            </button>

            {replaceMode && (
              <button
                onClick={() => {
                  setReplaceMode(false);
                  setSelectedFile(null);
                  setPreview(null);
                }}
                className="w-full py-3 mt-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
