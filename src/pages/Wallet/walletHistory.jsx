import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Info,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";

const API_BASE_URL = API_URL;

const getAuthToken = () => localStorage.getItem("accessToken");

export default function WalletTransactionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- Status Badge -------
  const getStatusBadge = (status) => {
    const base =
      "flex items-center gap-1 font-semibold text-sm px-2 py-1 rounded-full";

    if (status === "Approved" || status === "SUCCESS")
      return (
        <span className={`${base} bg-green-600/20 text-green-400`}>
          <CheckCircle size={14} /> Success
        </span>
      );

    if (status === "FAILED" || status === "Rejected")
      return (
        <span className={`${base} bg-red-600/20 text-red-400`}>
          <XCircle size={14} /> Failed
        </span>
      );

    return (
      <span className={`${base} bg-yellow-600/20 text-yellow-400`}>
        <Clock size={14} /> Pending
      </span>
    );
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // -------- Fetch API --------
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);

      try {
        const token = getAuthToken();

        const res = await axios.get(
          `${API_BASE_URL}/user/transactions-wallet-history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(res);

        setHistory(res.data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load transactions.");
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-md mx-auto font-sans text-white pb-10">
      {/* Header */}
      <h2 className="!text-lg p-4 bg-gradient-to-b from-black to-black/0 font-bold mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
        <DollarSign size={20} className="text-purple-400" />
        Wallet Transactions
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-center py-8 text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading history...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center py-6 text-red-400 bg-red-900/20 rounded-lg">
          <Info className="inline mr-2" size={18} /> {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && history.length === 0 && (
        <p className="text-center py-8 text-gray-400">No transactions found.</p>
      )}

      {/* Table */}
      {!loading && history.length > 0 && (
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
              {history.map((t) => (
                <tr key={t.tx_id} className="hover:bg-gray-700 transition">
                  <td
                    className={`px-4 py-3 font-medium text-sm ${
                      t.method === "Withdrawal"
                        ? "text-red-400" // withdrawal → red
                        : "text-green-400" // others → green
                    }`}
                  >
                    ₹{t.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {t.method?.toUpperCase() || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getStatusBadge(t.status)}
                  </td>
                  <td className="px-4 min-w-45 py-3 text-xs text-gray-400">
                    {formatDate(t.created_at)}
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
