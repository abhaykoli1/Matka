import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/deposit-qr";

const getToken = () => localStorage.getItem("accessToken");

export default function AdminDepositRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  // ------------------------------
  // Fetch Pending Deposits
  // ------------------------------
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setPending(res.data.pending);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load pending deposits");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ------------------------------
  // View QR Screenshot
  // ------------------------------
  const viewScreenshot = async (user_id) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/deposit-qr/image/${user_id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
          responseType: "blob",
        }
      );

      const imageURL = URL.createObjectURL(res.data);
      window.open(imageURL, "_blank");
    } catch (err) {
      alert("Screenshot not found!");
    }
  };

  // ------------------------------
  // Approve Deposit
  // ------------------------------
  const handleApprove = async (request_id) => {
    const amount = prompt("Enter amount to credit:");
    if (!amount) return;

    setProcessingId(request_id);

    const formData = new FormData();
    formData.append("request_id", request_id);
    formData.append("amount", amount);

    try {
      await axios.post(`${API_BASE}/approve`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      alert("Deposit approved!");
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to approve deposit");
    }

    setProcessingId(null);
  };

  // ------------------------------
  // Reject Deposit
  // ------------------------------
  const handleReject = async (request_id) => {
    if (!window.confirm("Reject this deposit?")) return;

    setProcessingId(request_id);

    const formData = new FormData();
    formData.append("request_id", request_id);

    try {
      await axios.post(`${API_BASE}/reject`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      alert("Deposit rejected!");
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to reject deposit");
    }

    setProcessingId(null);
  };

  // ------------------------------
  // UI
  // ------------------------------
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        Loading pending deposits...
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-6">Pending Deposit Requests</h2>

      {error && (
        <div className="bg-red-700/40 text-red-300 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="text-center text-gray-400 p-10 border border-gray-700 rounded">
          🎉 No pending deposits!
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs">User</th>
                <th className="px-4 py-3 text-left text-xs">Screenshot</th>
                <th className="px-4 py-3 text-left text-xs">Uploaded At</th>
                <th className="px-4 py-3 text-center text-xs">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {pending.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800">
                  <td className="px-4 py-4 text-sm">
                    <p className="font-semibold">{p.username}</p>
                    <p className="text-xs text-gray-400">{p.user_id}</p>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => viewScreenshot(p.user_id)}
                      className="text-blue-400 flex items-center gap-2 hover:text-blue-300"
                    >
                      <ImageIcon size={18} /> View Screenshot
                    </button>
                  </td>

                  <td className="px-4 py-4 text-xs text-gray-400">
                    {new Date(p.uploaded_at).toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-center space-x-2">
                    {processingId === p.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-full"
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleReject(p.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-full"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
