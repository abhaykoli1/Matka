import React, { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ListFilter,
  AlertTriangle,
  User,
} from "lucide-react";
import { API_URL } from "../../config";

const API_BASE_URL = API_URL;

const getAuthToken = () => localStorage.getItem("accessToken");

export default function AdminWithdrawalRequests() {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // Tracks which withdrawal is being processed

  // --- 1. Fetch Pending Withdrawals (GET /withdraw/admin/pending) ---
  const fetchPendingWithdrawals = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Admin authentication token missing. Cannot fetch data.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/withdraw/admin/pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingWithdrawals(data);
      } else {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Failed to fetch pending withdrawals. Check Admin role."
        );
        setPendingWithdrawals([]);
      }
    } catch (err) {
      setError("Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  // --- 2. Handle Action (Approve or Reject) ---
  const handleAction = async (wdId, endpoint, actionName) => {
    setProcessingId(wdId);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Admin token missing.");
      setProcessingId(null);
      return;
    }

    // Prepare form data for POST request (wd_id is the parameter name)
    const formData = new URLSearchParams();
    formData.append("wd_id", wdId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/withdraw/admin/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Log success and refresh the list to remove the processed withdrawal
        console.log(`${actionName} successful:`, data.message);
        fetchPendingWithdrawals();
      } else {
        const errorText =
          data.detail || `Failed to ${actionName.toLowerCase()} withdrawal.`;
        setError(errorText);
      }
    } catch (err) {
      setError(`Network error during ${actionName.toLowerCase()}.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = (wdId) => handleAction(wdId, "approve", "Approve");
  const handleReject = (wdId) => handleAction(wdId, "reject", "Reject");

  // --- Rendering Functions ---
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading pending withdrawals...
      </div>
    );
  }

  return (
    <div className=" mx-auto p-3 font-sans text-white bg- min-h-screen">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3   pb-2">
        Pending Withdrawal Requests
      </h2>

      {error && (
        <div className="p-4 bg-red-600/20 text-red-300 rounded-lg mb-4 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>Error: {error}</p>
        </div>
      )}

      {pendingWithdrawals.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-700 rounded-lg">
          <p className="text-lg">
            ✅ All clear! No pending withdrawal requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  User ID / Request ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Requested At
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pendingWithdrawals.map((wd) => (
                <tr key={wd.wd_id} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-3 text-sm">
                    <p className="font-semibold text-gray-200 flex items-center gap-1">
                      <User
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />
                      User: {wd.user_id.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      WD ID: {wd.wd_id.substring(0, 8)}...
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-lg font-bold text-red-400">
                    -₹{wd.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium text-purple-300">{wd.method}</p>
                    <p className="text-xs text-gray-400">{wd.number}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatTime(wd.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                    {processingId === wd.wd_id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-400 inline" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(wd.wd_id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition duration-150"
                          title="Approve Withdrawal (Deduct Funds)"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(wd.wd_id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition duration-150"
                          title="Reject Withdrawal"
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
