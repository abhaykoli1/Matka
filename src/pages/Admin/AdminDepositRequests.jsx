import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { API_URL } from "../../config";

const API_BASE = `${API_URL}`;
const getToken = () => localStorage.getItem("accessToken");

export default function AdminDepositRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  // FETCH PENDING LIST
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/user-deposit-withdrawal/admin/deposit/pending`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log(res);

      setPending(res.data.pending || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // VIEW SCREENSHOT
  const viewScreenshot = (path) => {
    window.open(API_URL + path, "_blank");
  };

  // APPROVE
  const handleApprove = async (request_id) => {
    const amount = prompt("Enter amount to credit:");
    if (!amount) return;

    setProcessingId(request_id);

    const fd = new FormData();
    fd.append("request_id", request_id);
    fd.append("amount", amount);

    try {
      const res = await axios.post(
        `${API_URL}/user-deposit-withdrawal/admin/deposit/approve`,
        fd,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      console.log(res);

      alert("Deposit Approved!");
      fetchPending();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.detail);
    }

    setProcessingId(null);
  };

  // REJECT
  const handleReject = async (request_id) => {
    if (!window.confirm("Reject this deposit?")) return;

    setProcessingId(request_id);

    const fd = new FormData();
    fd.append("request_id", request_id);

    try {
      await axios.post(
        `${API_URL}/user-deposit-withdrawal/admin/deposit/reject`,
        fd,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      alert("Deposit Rejected!");
      fetchPending();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Failed to reject request");
    }

    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        Loading pending deposit requests...
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
        <div className="overflow-x-auto bg-white/10 rounded-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs">User</th>
                <th className="px-4 py-3 text-left text-xs">Method</th>
                <th className="px-4 py-3 text-left text-xs">Amount</th>
                <th className="px-4 py-3 text-left text-xs">Status</th>
                <th className="px-4 py-3 text-left text-xs">Screenshot</th>
                <th className="px-4 py-3 text-left text-xs">Uploaded At</th>
                <th className="px-4 py-3 text-center text-xs">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {pending.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  {/* USER */}
                  <td className="px-4 py-4 text-sm">
                    <p className="font-semibold">{p.username}</p>
                    <p className="text-xs text-gray-400">{p.user_id}</p>
                  </td>

                  {/* METHOD */}
                  <td className="px-4 py-4 text-sm text-gray-300">
                    {p.method || "—"}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 py-4 text-sm font-bold text-green-400">
                    ₹ {p.amount || 0}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        p.status === "PENDING"
                          ? "bg-yellow-600/40 text-yellow-300"
                          : p.status === "SUCCESS"
                          ? "bg-green-600/40 text-green-300"
                          : "bg-red-600/40 text-red-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* SCREENSHOT */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => viewScreenshot(p.image_url)}
                      className="text-blue-400 flex items-center gap-2 hover:text-blue-300"
                    >
                      <ImageIcon size={18} /> View
                    </button>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-xs text-gray-400">
                    {new Date(p.uploaded_at).toLocaleString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4 flex gap-1 text-center space-x-2">
                    {processingId === p.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(p.id)}
                          className={` p-2  bg-green-600 hover:bg-green-700 rounded-full`}
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleReject(p.id)}
                          className={`p-2 bg-red-600 hover:bg-red-700 rounded-full`}
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
