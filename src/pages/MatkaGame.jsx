import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for potential back navigation
import { ArrowLeft, XCircle, CheckCircle, Loader } from "lucide-react";
import { getMarketById } from "./Admin/Market/marketapi";

// --- Configuration and Mock API Setup ---
// NOTE: In a real app, this base URL would be managed by an environment variable.
// I'm assuming the API endpoint is accessible at this relative path.
const API_BASE_URL = "/api";
const BID_ENDPOINT = `${API_BASE_URL}/place`;

// Helper to determine the actual game type for the API from the URL slug
// e.g., "jodi-digit" -> "jodi"
const extractGameType = (gameIdSlug) => {
  // This is a simple assumption based on common Matka game slugs.
  // In a real system, you'd use a more robust lookup.
  return gameIdSlug.split("-")[0].toLowerCase();
};

/**
 * Mocks the necessary dependencies like `getMarketById` and authentication checks.
 * In a real application, you would ensure these are correctly imported and handle auth tokens.
 */

// --- Custom Modal Component (Replaces alert() and confirm()) ---
const Modal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : type === "error" ? (
      <XCircle className="w-6 h-6 text-red-500" />
    ) : (
      <Loader className="w-6 h-6 text-blue-500 animate-spin" />
    );

  const borderColor =
    type === "success"
      ? "border-green-600"
      : type === "error"
      ? "border-red-600"
      : "border-blue-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm border-t-4 ${borderColor}`}
      >
        <div className="flex items-center space-x-3 mb-4">
          {icon}
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end">
          {type !== "loading" && (
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                type === "error"
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-purple-700 hover:bg-purple-600"
              } text-white`}
            >
              {type === "error" ? "Dismiss" : "OK"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main MatkaGame Component ---
export default function MatkaGame() {
  // React Router hooks
  const { marketId, gameId } = useParams();
  const navigate = useNavigate();

  console.log(marketId, gameId);
  // Game ID Transformation for Display
  const transformedGameId = gameId
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const gameType = extractGameType(gameId); // e.g., "jodi"

  // State for Form Input
  const [session, setSession] = useState("Open");
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");

  // State for Bidding Queue
  const [bidQueue, setBidQueue] = useState([]);

  // State for Market Details
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for Modal Messages
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived State for UI Summary
  const totalBids = bidQueue.length;
  const totalAmount = bidQueue.reduce((sum, bid) => sum + bid.points, 0);

  // --- API Calls ---

  // 1. Fetch Market Details
  const fetchMarketDetails = useCallback(async () => {
    if (!marketId) {
      setModal({
        isOpen: true,
        title: "Error",
        message: "Market ID is missing.",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getMarketById(marketId);
      console.log(data);
      setMarket(data);
    } catch (err) {
      console.log("Fetch market details error:", err);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Failed to load market details. Check API connection.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [marketId]);

  // 2. Place Single Bid API Call
  const placeBidApi = async (bidData) => {
    try {
      // Note: I'm omitting the actual fetch call for the canvas environment
      // since we don't have a live backend, but this shows the structure.
      // In a real app, you would use `fetch` with proper headers (like Authorization).

      // Example Fetch Structure:
      /*
            const response = await fetch(BID_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
                },
                body: JSON.stringify(bidData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to place bid on server.');
            }
            
            return await response.json();
            */

      // --- MOCK API RESPONSE START ---
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (bidData.points > 500) {
        throw new Error("Mock Error: Points limit exceeded (Max 500).");
      }
      return {
        msg: "Bid Successfully Placed",
        bid: { ...bidData, id: Math.random().toString(36).substring(7) },
      };
      // --- MOCK API RESPONSE END ---
    } catch (error) {
      console.error("Bid submission failed:", error);
      throw error;
    }
  };

  // --- Handlers ---

  // Called when component loads
  useEffect(() => {
    fetchMarketDetails();
  }, [fetchMarketDetails]);

  // Add current form input to the queue
  const handleAddBid = (e) => {
    e.preventDefault();

    // 1. Validation Checks
    if (!digit || !points) {
      setModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please enter both Digit and Points.",
        type: "error",
      });
      return;
    }

    const numericPoints = parseInt(points, 10);
    if (isNaN(numericPoints) || numericPoints <= 0) {
      setModal({
        isOpen: true,
        title: "Validation Error",
        message: "Points must be a positive number.",
        type: "error",
      });
      return;
    }

    // 2. Create the Bid Object
    const newBid = {
      id: Date.now(), // Temporary ID for queue
      session: session.toLowerCase(),
      digit: digit.trim(),
      points: numericPoints,
    };

    // 3. Add to Queue and Reset Form
    setBidQueue((prev) => [...prev, newBid]);
    setDigit("");
    setPoints("");
  };

  // Submits all bids in the queue to the backend
  const handlePlaceAllBids = async () => {
    if (bidQueue.length === 0) {
      setModal({
        isOpen: true,
        title: "Notice",
        message: "Please add at least one bid before placing.",
        type: "info",
      });
      return;
    }

    // Final payload construction
    const bidsToSubmit = bidQueue.map((b) => ({
      market_id: marketId,
      game_type: gameType, // e.g., "jodi"
      session: b.session,
      digit: b.digit,
      points: b.points,
    }));

    let successCount = 0;
    let failedCount = 0;
    setIsSubmitting(true);
    setModal({
      isOpen: true,
      title: "Submitting Bids",
      message: `Processing ${bidsToSubmit.length} bids...`,
      type: "loading",
    });

    // Process bids sequentially
    for (const bid of bidsToSubmit) {
      try {
        await placeBidApi(bid);
        successCount++;
      } catch (error) {
        console.error(`Failed to submit bid for digit ${bid.digit}:`, error);
        failedCount++;
      }
    }

    // Final Status Update
    setIsSubmitting(false);
    setBidQueue([]); // Clear queue after attempt

    if (failedCount === 0) {
      setModal({
        isOpen: true,
        title: "Success!",
        message: `${successCount} bids placed successfully!`,
        type: "success",
      });
    } else {
      setModal({
        isOpen: true,
        title: "Partial Failure",
        message: `${successCount} bids succeeded. ${failedCount} bids failed to submit. Please check the console for details.`,
        type: "error",
      });
    }
  };

  const handleRemoveBid = (id) => {
    setBidQueue((prev) => prev.filter((bid) => bid.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
        <p className="ml-3">Loading Market...</p>
      </div>
    );
  }

  // UI Render
  return (
    <div className="max-w-md mx-auto flex flex-col font-sans min-h-screen  text-gray-200">
      {/* Modal Renderer */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() =>
          modal.type !== "loading" && setModal({ ...modal, isOpen: false })
        }
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* Header */}
      <div className="sticky top-0 w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-between px-4 z-10 ">
        <h1 className="text-lg font-extrabold text-center flex-grow">
          {market?.name} - {transformedGameId}
        </h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex-grow px-4 pb-20">
        {market === null && (
          <div className="bg-red-900 text-white p-3 rounded-lg mt-4 text-center">
            Market details could not be loaded.
          </div>
        )}

        <form
          onSubmit={handleAddBid}
          className="flex flex-col bg-white/20 gap-3 mt-3 border border-gray-700 p-4 rounded-xl "
        >
          <h2 className="text-lg font-bold text-white">Place Bid</h2>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-300">
              Choose Session
            </h3>
            <div className="flex items-center gap-6">
              {["Open", "Close"].map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition duration-150 hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="session"
                    value={s}
                    checked={session === s}
                    onChange={(e) => setSession(e.target.value)}
                    className="accent-[#79049a] w-4 h-4"
                  />
                  <span className="text-gray-200 font-medium">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Enter Digit ({transformedGameId}):
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter digits"
              value={digit}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, ""); // only digits

                let maxLen = 3; // default

                if (gameId === "single-digit") maxLen = 1;
                else if (gameId === "jodi-digit") maxLen = 2;
                else if (gameId === "single-panna") maxLen = 1;
                else if (gameId === "double-panna") maxLen = 2;
                else if (gameId === "triple-panna") maxLen = 3;

                if (val.length <= maxLen) {
                  setDigit(val);
                }
              }}
              className="w-full border border-gray-600 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Points
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Minimum 10 points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full border border-gray-600 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-tl from-[#212b61] to-[#79049a] text-white font-bold py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-[1.01]"
          >
            Add Bid to List
          </button>
        </form>

        <div className="mt-4 pb-20">
          <h2 className="text-md font-medium mb-4 text-white border-b border-gray-700 pb-2">
            Bid List ({totalBids} Items)
          </h2>
          <div className="space-y-3">
            {bidQueue.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No bids added yet.
              </p>
            ) : (
              bidQueue.map((bid, index) => (
                <div
                  key={bid.id}
                  className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-white">
                      Digit: {bid.digit} ({bid.session.toUpperCase()})
                    </span>
                    <span className="text-purple-300">
                      Points: {bid.points}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveBid(bid.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 max-w-md mx-auto left-0 right-0 bg-gray-800 border-t border-purple-500 py-3 px-4 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <div className="text-center w-1/3">
            <p className="font-semibold text-gray-400 text-xs">Total Bids</p>
            <p className="text-xl font-bold text-white">{totalBids}</p>
          </div>
          <div className="text-center w-1/3">
            <p className="font-semibold text-gray-400 text-xs">Total Amount</p>
            <p className="text-xl font-bold text-white">₹{totalAmount}</p>
          </div>
          <button
            onClick={handlePlaceAllBids}
            disabled={totalBids === 0 || isSubmitting}
            className={`px-3 font-bold py-3 rounded-full transition duration-300 ${
              totalBids > 0 && !isSubmitting
                ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader className="w-5 h-5 mr-2 animate-spin" /> Submitting...
              </span>
            ) : (
              `Place ${totalBids} Bid${totalBids !== 1 ? "s" : ""} Now`
            )}
          </button>
          {/* <div className="text-center w-1/3">
            <p className="font-semibold text-gray-400 text-xs">Balance</p>
            <div className="flex items-center justify-center text-xl font-bold text-green-400">
              <Wallet className="w-4 h-4 mr-1" /> 5000
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
