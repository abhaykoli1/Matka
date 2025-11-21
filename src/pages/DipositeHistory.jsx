import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Info,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const getAuthToken = () => localStorage.getItem("accessToken");

export default function MyDepositHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status UI
  const getStatusDisplay = (status) => {
    const style =
      "flex items-center gap-1 font-semibold text-sm px-2 py-1 rounded-full";

    switch (status) {
      case "SUCCESS":
        return (
          <span className={`${style} bg-green-600/20 text-green-400`}>
            <CheckCircle size={14} /> Success
          </span>
        );

      case "FAILED":
        return (
          <span className={`${style} bg-red-600/20 text-red-400`}>
            <XCircle size={14} /> Failed
          </span>
        );

      default:
        return (
          <span className={`${style} bg-yellow-600/20 text-yellow-400`}>
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  // Fetch Deposit History API
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Login required.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/user/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        } else {
          const errorData = await res.json();
          setError(errorData.detail || "Failed to fetch deposit history.");
        }
      } catch (err) {
        setError("Network error. Cannot fetch deposits.");
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  const formatTime = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-md mx-auto font-sans text-white">
      <h2 className="text-xl p-4 bg-gradient-to-b from-black to-black/0 font-bold mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
        <DollarSign className="text-purple-400" />
        My Deposit History
      </h2>

      {loading && (
        <p className="text-center py-8 text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading deposits...
        </p>
      )}

      {error && (
        <p className="text-center py-6 text-red-400 bg-red-900/20 rounded-lg">
          <Info className="inline mr-2" size={18} />
          {error}
        </p>
      )}

      {!loading && !error && transactions.length === 0 && (
        <p className="text-center py-8 text-gray-400">
          No deposit records found.
        </p>
      )}

      {!loading && transactions.length > 0 && (
        <div className="overflow-x-auto m-3 bg-gray-800 rounded-lg shadow-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {transactions.map((tx) => (
                <tr key={tx.tx_id} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-3 text-lg font-bold text-green-400">
                    ₹{tx.amount.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-300">
                    {tx.method}
                  </td>

                  <td className="px-4 py-3">{getStatusDisplay(tx.status)}</td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatTime(tx.created_at)}
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
