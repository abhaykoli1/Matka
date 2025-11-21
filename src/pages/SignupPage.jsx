import React, { useState } from "react";

// Define the API URL. Note: For this code to work, your FastAPI server
// must be running at this address (http://127.0.0.1:8000) and must have
// **CORS enabled** to allow requests from the browser's origin.
const API_BASE_URL = "http://127.0.0.1:8000";

export default function SignupPage() {
  const [username, setUsername] = useState("abhay");
  const [mobile, setMobile] = useState("0987654321");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // To store success or error message

  const handleSignup = async () => {
    // 1. Basic validation
    if (!username || !mobile || mobile.length !== 10 || !password) {
      setMessage({
        type: "error",
        text: "Please fill in all fields correctly, and ensure the mobile number is 10 digits.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const payload = {
      username: username,
      mobile: mobile,
      password: password,
    };

    try {
      // *** Using the native 'fetch' API instead of axios ***
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response status is NOT in the 200-299 range (e.g., 4xx or 5xx)
      if (!response.ok) {
        // Attempt to parse the server's error message (FastAPI usually returns JSON error objects)
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, fall back to a generic message
          throw new Error(`Server responded with status ${response.status}`);
        }

        // Throw an error with the server's detail, or a default message
        const detail = errorData.detail || `HTTP Error ${response.status}`;
        throw new Error(detail);
      }

      // If response.ok is true, parse the successful response data
      const data = await response.json();

      // Registration successful
      setMessage({
        type: "success",
        text: `Registration successful for user: ${data.username}. You can now proceed to log in!`,
      });
      // Optionally clear the form
      setUsername("");
      setMobile("");
      setPassword("");
    } catch (error) {
      console.log("Signup error:", error);
      // This catches network errors (error.message) or the custom error thrown above

      let errorMessage =
        "Could not connect to the server. Please check your network and CORS configuration.";

      // If the error was thrown by the server response logic (not a network failure),
      // use the specific detail message.
      if (error.message && !error.message.includes("Failed to fetch")) {
        errorMessage = `Signup Failed: ${error.message}`;
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for loading spinner (inline SVG)
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-black/60 flex flex-col items-center justify-start font-sans relative">
      {/* Signup Card */}
      <div className="bg-white/10 mt-16 w-[93%] max-w-sm rounded-xl shadow-lg p-4 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-white text-center tracking-wide">
          User Register
        </h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Create your account now!
        </p>

        {/* Message Box */}
        {message && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm font-medium ${
              message.type === "error"
                ? "bg-red-500/80 text-white"
                : "bg-green-500/80 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Username Input */}
        <label className="text-sm font-semibold text-gray-300">Username</label>
        <div className="relative mt-1 mb-4">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-white placeholder-gray-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-purple-400 text-lg">
            👤
          </span>
        </div>

        {/* Mobile Number Input */}
        <label className="text-sm font-semibold text-gray-300">
          Mobile Number
        </label>
        <div className="relative mt-1 mb-4">
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))} // Only allow digits
            maxLength={10}
            className="w-full border-2 border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-white placeholder-gray-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-purple-400 text-lg">
            📱
          </span>
          <span className="absolute right-3 top-2.5 text-gray-400 text-xs">
            {mobile.length} / 10
          </span>
        </div>

        {/* Password Input */}
        <label className="text-sm font-semibold text-gray-300">Password</label>
        <div className="relative mt-1 mb-5">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-transparent text-white placeholder-gray-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-purple-400 text-lg">
            🔒
          </span>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 text-white px-2.5 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Signing up...
            </>
          ) : (
            "Signup"
          )}
        </button>

        {/* Already have an account */}
        <p className="text-center text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <a href="#" className="text-purple-400 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Contact Section */}
      <div className="text-center mt-6 text-sm text-gray-300">
        <p>Contact Us:</p>
        <div className="flex items-center justify-center mt-1">
          <span className="text-green-500 text-xl mr-2">💬</span>
          <a
            href="https://wa.me/917726035987"
            className="text-green-400 font-semibold hover:underline"
          >
            +91 7726035987
          </a>
        </div>
      </div>
    </div>
  );
}
