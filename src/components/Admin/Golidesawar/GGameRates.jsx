import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GGameRates() {
  const [form, setForm] = useState({
    // VALUE 1
    single_digit_1: 10,
    jodi_digit_1: 10,
    single_pana_1: 10,
    double_pana_1: 10,
    tripple_pana_1: 10,
    half_sangam_1: 10,
    full_sangam_1: 10,
    left_digit_1: 10,
    right_digit_1: 10,
    starline_single_digit_1: 10,
    starline_single_pana_1: 10,
    starline_double_pana_1: 10,
    starline_tripple_pana_1: 10,

    // VALUE 2
    single_digit_2: 100,
    jodi_digit_2: 995,
    single_pana_2: 1500,
    double_pana_2: 3000,
    tripple_pana_2: 7000,
    half_sangam_2: 10000,
    full_sangam_2: 100000,
    left_digit_2: 100,
    right_digit_2: 100,
    starline_single_digit_2: 100,
    starline_single_pana_2: 1500,
    starline_double_pana_2: 3000,
    starline_tripple_pana_2: 7000,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await axios.post("/api/admin/Golidesawar/rate/", form);
      setMessage("Updated Successfully");
    } catch (err) {
      setMessage("Error Updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  text-white p-6">
      <h1 className="text-xl font-bold mb-4"> Game Rates</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          {Object.keys(form)
            .filter((key) => key.endsWith("_1"))
            .map((key) => (
              <div key={key}>
                <label className="block text-sm mb-1 capitalize">
                  {key.replaceAll("_", " ")}
                </label>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full p-2 rounded  border border-gray-700 focus:outline-none"
                />
              </div>
            ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          {Object.keys(form)
            .filter((key) => key.endsWith("_2"))
            .map((key) => (
              <div key={key}>
                <label className="block text-sm mb-1 capitalize">
                  {key.replaceAll("_", " ")}
                </label>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full p-1.5 rounded  border border-gray-700 focus:outline-none"
                />
              </div>
            ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
      >
        {loading ? "Saving..." : "Submit"}
      </button>

      {message && <p className="mt-3 text-green-400">{message}</p>}
    </div>
  );
}
