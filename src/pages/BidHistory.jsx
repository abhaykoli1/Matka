import React, { useState } from "react";
import { ArrowLeft, Search, CalendarX } from "lucide-react";

const BidHistoryPage = () => {
  // State for the date inputs
  const [dates, setDates] = useState({
    startDate: "20-11-2025", // Mock current date
    toDate: "20-11-2025", // Mock current date
  });

  // State to simulate data fetching (showing the 'No Data' state by default)
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Wining History Data Not Available"); // Text as per the image

  const handleDateChange = (e) => {
    setDates({
      ...dates,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    // In a real app, you would make an API call here, e.g.:
    // fetchBidHistory(dates.startDate, dates.toDate)
    console.log("Submitting date range:", dates);

    // Simulate API response delay and result (e.g., still no data)
    setTimeout(() => {
      setLoading(false);
      setHistoryData([]); // Still empty for demonstration
      setMessage("Wining History Data Not Available");
    }, 1500);
  };

  // Component for displaying the rate card fields
  const DateInput = ({ label, name, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-gray-200 font-medium mb-1 pl-1">
        {label}
      </label>
      <input
        type="text" // Using text type to show "DD-MM-YYYY" format easily
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-white text-gray-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
        placeholder="DD-MM-YYYY"
      />
    </div>
  );

  // No Data Illustration Component
  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center mt-12 p-6 text-center">
      {/* Visual Placeholder (Replicating the style with an icon) */}
      <div className="relative mb-6">
        <CalendarX size={80} className="text-purple-300 mx-auto" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-4 border-gray-100"></div>
      </div>

      {/* Text Message */}
      <p className="text-gray-600 font-semibold text-lg max-w-xs">{message}</p>
    </div>
  );

  return (
    // Main container with a light background
    <div className="max-w-md mx-auto font-sans">
      {/* 1. Header Section (Purple) */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        <h1 className="text-lg font-semibold"> Bid History</h1>
      </div>

      {/* 2. Content Container */}
      <div className="p-3">
        {/* Date Filters Card */}
        <div className="bg-white/20 rounded-xl shadow-lg p-4 mb-6">
          <DateInput
            label="Start Date"
            name="startDate"
            value={dates.startDate}
            onChange={handleDateChange}
          />
          <DateInput
            label="To Date"
            name="toDate"
            value={dates.toDate}
            onChange={handleDateChange}
          />

          {/* Submit Button (Purple, Full Width) */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center bg-gradient-to-bl from-[#212b61] to-[#79049a] text-white font-bold py-3 px-4 rounded-xl shadow-xl hover:bg-purple-800 transition transform hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Submit
              </>
            )}
          </button>
        </div>

        {/* History Results / No Data State */}
        {loading && (
          <div className="text-center text-gray-600 mt-8">
            Loading history...
          </div>
        )}

        {!loading && historyData.length === 0 && <NoDataDisplay />}

        {/* Placeholder for Data List (if historyData was not empty) */}
        {/* {!loading && historyData.length > 0 && (
          <div className="mt-6 space-y-3">
            {historyData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                <p>
                  Bet on {item.market} for ₹{item.stake}
                </p>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BidHistoryPage;
