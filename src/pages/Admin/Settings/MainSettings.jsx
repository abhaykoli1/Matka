import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

export default function MainSettings() {
  const API_BASE = API_URL; // change to production URL

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    min_deposit: "0",
    max_deposit: "0",
    min_withdraw: "0",
    max_withdraw: "0",
    min_transfer: "0",
    max_transfer: "0",
    min_bid: "0",
    max_bid: "0",
    welcome_bonus: "0",
    withdraw_open_time: "0",
    withdraw_close_time: "0",
    website_link: "0",
  });

  // -------------------------------------
  // LOAD SETTINGS ON PAGE LOAD
  // -------------------------------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/settings/get`);

        // If backend returns no settings, skip
        if (!res.data || res.data.message === "No settings found") return;

        setFormData(res.data);
      } catch (err) {
        console.log("Error loading settings", err);
      }
    };

    loadSettings();
  }, []);

  // -------------------------------------
  // HANDLE INPUT CHANGE
  // -------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------------------
  // SUBMIT FORM (UPDATE SETTINGS)
  // -------------------------------------
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/settings/update`, formData);
      alert("Settings Updated Successfully!");
    } catch (err) {
      console.log(err);
      alert("Error saving settings!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-3  shadow rounded mt-4">
      <h1 className="text-2xl font-semibold mb-6">Main Settings</h1>

      {/* GRID FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Minimum Deposit */}
        <div>
          <label className="font-medium text-sm">Minimum Deposit</label>
          <input
            name="min_deposit"
            value={formData.min_deposit}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="100"
            type="number"
          />
        </div>

        {/* Maximum Deposit */}
        <div>
          <label className="font-medium text-sm">Maximum Deposit</label>

          <input
            name="max_deposit"
            value={formData.max_deposit}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="100000"
            type="number"
          />
        </div>

        {/* Minimum Withdrawal */}
        <div>
          <label className="font-medium text-sm">Minimum Withdrawal</label>
          <input
            name="min_withdraw"
            value={formData.min_withdraw}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="1000"
            type="number"
          />
        </div>

        {/* Maximum Withdrawal */}
        <div>
          <label className="font-medium text-sm">Maximum Withdrawal</label>
          <input
            name="max_withdraw"
            value={formData.max_withdraw}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="500000"
            type="number"
          />
        </div>

        {/* Minimum Transfer */}
        <div>
          <label className="font-medium text-sm">Minimum Transfer</label>
          <input
            name="min_transfer"
            value={formData.min_transfer}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="50000"
            type="number"
          />
        </div>

        {/* Maximum Transfer */}
        <div>
          <label className="font-medium text-sm">Maximum Transfer</label>
          <input
            name="max_transfer"
            value={formData.max_transfer}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="500000"
            type="number"
          />
        </div>

        {/* Minimum Bid */}
        <div>
          <label className="font-medium text-sm">Minimum Bid Amount</label>
          <input
            name="min_bid"
            value={formData.min_bid}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="10"
            type="number"
          />
        </div>

        {/* Maximum Bid */}
        <div>
          <label className="font-medium text-sm">Maximum Bid Amount</label>
          <input
            name="max_bid"
            value={formData.max_bid}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="50000"
            type="number"
          />
        </div>

        {/* Welcome Bonus */}
        {/* <div>
          <label className="font-medium text-sm">Welcome Bonus</label>
          <input
            name="welcome_bonus"
            value={formData.welcome_bonus}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="1"
            type="number"
          />
        </div> */}

        {/* Withdraw Open Time */}
        {/* <div>
          <label className="font-medium text-sm">Withdraw Open Time</label>
          <input
            name="withdraw_open_time"
            value={formData.withdraw_open_time}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="11:00 AM"
            type="text"
          />
        </div> */}

        {/* Withdraw Close Time */}
        {/* <div>
          <label className="font-medium text-sm">Withdraw Close Time</label>
          <input
            name="withdraw_close_time"
            value={formData.withdraw_close_time}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="07:00 PM"
            type="text"
          />
        </div> */}

        {/* Website Link */}
        {/* <div className="md:col-span-2 lg:col-span-3">
          <label className="font-medium text-sm">
            Website & Share Button Link
          </label>
          <input
            name="website_link"
            value={formData.website_link}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="https://example.com"
            type="text"
          />
        </div> */}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}
