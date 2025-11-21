// src/components/MarketForm.jsx
import React, { useState, useEffect } from "react";
import { createMarket, updateMarket } from "./marketapi";

// Helper function to format date string (YYYY-MM-DD)
// This is needed because the "date" input type uses this format.
const getFormattedDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MarketForm = ({ market, onClose, onSave }) => {
  // Initialize form state
  const [name, setName] = useState(market ? market.name : "");
  const [openTime, setOpenTime] = useState(market ? market.open_time : "");
  const [closeTime, setCloseTime] = useState(market ? market.close_time : "");
  // --- NEW STATE FOR DATE ---
  // Assuming 'market' might have a date field if your backend was updated.
  // For now, initializing to today's date if creating, or market's date if updating.
  const initialDate =
    market && market.market_date
      ? getFormattedDate(market.market_date)
      : getFormattedDate(new Date());
  const [marketDate, setMarketDate] = useState(initialDate);
  // --------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isUpdate = !!market;
  const marketId = market?._id.$oid; // Assuming your mongoengine id is structured like this in the JSON response

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // **NOTE:** Only sending fields that your current FastAPI endpoints expect.
    // To send 'marketDate', you MUST update your FastAPI API and MongoEngine model.
    const marketData = {
      name,
      open_time: openTime,
      close_time: closeTime,
      // If your backend accepted it, you'd add: market_date: marketDate
    };

    try {
      if (isUpdate) {
        await updateMarket(marketId, marketData);
      } else {
        await createMarket(marketData);
      }
      onSave(); // Refresh the list
      onClose(); // Close the form
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isUpdate ? "Update Market" : "Create New Market"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* --- NEW DATE CALENDAR INPUT --- */}
          {/* <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="market_date"
            >
              Market Date 📅
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="market_date"
              type="date"
              value={marketDate}
              onChange={(e) => setMarketDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div> */}
          {/* ------------------------------- */}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="open_time"
            >
              Open Time (HH:MM) ⏰
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="open_time"
              type="time" // Changed to type="time" for better UX
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="close_time"
            >
              Close Time (HH:MM) 🛑
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="close_time"
              type="time" // Changed to type="time" for better UX
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mb-4">Error: {error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isUpdate ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarketForm;
