import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

// Verify this URL is correct based on your backend routing structure!
const API_BASE = "http://127.0.0.1:8000/starline_jackpot";

const AdminStartline = () => {
  // --- State Management ---
  const [slots, setSlots] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form State for adding a new slot
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
  });

  // --- API Calls & Logic ---

  // 1. Fetch Slots (GET /starline/list) using axios
  const fetchSlots = async () => {
    setLoadingList(true);
    try {
      const response = await axios.get(`${API_BASE}/starline/list`);
      setSlots(response.data);
      setMessage(""); // Clear message on successful list fetch
    } catch (error) {
      console.error("Error fetching slots:", error);
      setMessage("❌ Could not load slots. Check server connection.");
      setSlots([]);
    } finally {
      setLoadingList(false);
    }
  };

  // Run fetchSlots on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchSlots();
  }, [refreshTrigger]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Add Slot (POST /starline/add) using axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const slotData = {
      name: formData.name.trim(), // Trim whitespace
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    // 💡 FIX 1: Client-side validation to ensure fields are not empty before API call
    if (!slotData.name || !slotData.start_time || !slotData.end_time) {
      setMessage("❌ All slot fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/starline/add`, slotData);

      if (response.status === 200 || response.status === 201) {
        setMessage(`✅ Success! Slot Added (ID: ${response.data.slot_id})`);
        setFormData({ name: "", start_time: "", end_time: "" }); // Reset form
        setRefreshTrigger((prev) => prev + 1); // Trigger list refresh
      }
    } catch (error) {
      console.log("Error adding slot:", error);

      if (error.response) {
        // More specific error handling for Pydantic/FastAPI errors
        const errorDetail =
          error.response.data.detail?.[0]?.msg || error.response.data.msg;
        const errorMsg = errorDetail || "Failed to add slot.";
        setMessage(`❌ Error: ${errorMsg}`);
      } else if (error.request) {
        setMessage("❌ Network Error: Server did not respond.");
      } else {
        setMessage("❌ An unexpected client error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // --- Component Render ---
  return (
    // 💡 FIX 2: Restored Tailwind classes for background color and padding
    <div className="p-6  min-h-screen">
      <h1 className="text-xl font-bold text-white mb-6 border-b pb-2">
        ⭐ Starline Slot Management
      </h1>

      {/* API Message Display */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-md text-sm font-medium ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Section 1: Add New Slot Form (POST /starline/add) --- */}
        <div className="lg:col-span-1">
          {/* 💡 FIX 3: Restored Tailwind classes for background, padding, and shadow */}
          <div className="">
            {/* 💡 FIX 4: Restored Tailwind classes for text color and size */}
            <h2 className="text-xl font-semibold text-white mb-4">
              ➕ Add New Slot
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Slot Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Slot Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-white gray-700"
                >
                  Start Time (HH:MM)
                </label>
                <input
                  type="time"
                  name="start_time"
                  id="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-white gray-700"
                >
                  End Time (HH:MM)
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? "Adding Slot..." : "Add Starline Slot"}
              </button>
            </form>
          </div>
        </div>

        {/* --- Section 2: Slot List Table (GET /starline/list) --- */}
        <div className="lg:col-span-2">
          <div className=" rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white indigo-600">
                📋 Existing Slots
              </h2>
              <button
                onClick={handleRefresh}
                disabled={loadingList}
                className="flex items-center space-x-1 p-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m15.356-2H15V2M7 13.582V19H.582m0 0a8.001 8.001 0 0015.356-2H17v-5"
                  ></path>
                </svg>
                <span className="text-white">
                  {loadingList ? "Refreshing..." : "Refresh List"}
                </span>
              </button>
            </div>

            {loadingList ? (
              <p className="text-gray-500 text-center py-8">Loading slots...</p>
            ) : slots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No Starline slots found. Add one on the left!
              </p>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games Allowed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {slot.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.start_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.end_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {Array.isArray(slot.games) &&
                            slot.games.map((game) => (
                              <span
                                key={game}
                                className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2 mb-1"
                              >
                                {game}
                              </span>
                            ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStartline;
