import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogIn, User, Power, Loader2, Smartphone, Lock } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

// Helper component for loading spinner
const LoadingSpinner = () => <Loader2 className="animate-spin h-5 w-5 mr-2" />;

// Main Application Component
export default function App() {
  const [mobile, setMobile] = useState("1234567890");
  const [password, setPassword] = useState("ipkkoo");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // To store success or error message
  const [accessToken, setAccessToken] = useState(null); // Track authentication state

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      setMessage({ type: "info", text: "You are already logged in." });
    }
  }, []);

  const handleLogin = async () => {
    // 1. Basic validation
    if (!mobile || !password || mobile.length !== 10) {
      setMessage({
        type: "error",
        text: "Please enter a 10-digit mobile number and your password.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // FIX FOR 422 ERROR: Send data as JSON body (application/json)
    // This matches what a typical FastAPI Pydantic schema expects (e.g., LoginSchema)
    const payload = {
      mobile: mobile, // Ensure this field name matches your LoginSchema
      password: password,
    };

    try {
      // POST request to the token endpoint
      const response = await axios.post(
        `${API_BASE_URL}/auth/token`, // Adjust endpoint if your router prefix is different
        payload, // Send the payload object directly (Axios defaults to JSON)
        {
          headers: {
            // We can omit this, but explicitly setting it confirms JSON data is sent.
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data; // { access_token: "...", token_type: "bearer" }

      // Login successful. Store the token and update state.
      localStorage.setItem("accessToken", data.access_token);
      setAccessToken(data.access_token);
      setMessage({
        type: "success",
        text: `Login successful! Token stored. Token Type: ${data.token_type}`,
      });
      window.location.href = "/"; // Redirect to home or dashboard

      // Clear the form fields on success
      setMobile("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        // Server responded with an error (e.g., 401 Unauthorized, 400 Bad Request)
        const detail =
          error.response.data.detail || "Invalid mobile number or password.";

        // Show the 422 error details if validation failed
        const validationError = error.response.data.detail?.find(
          (d) => d.type === "missing"
        );
        if (validationError) {
          setMessage({
            type: "error",
            text: `Validation Error: Missing field '${validationError.loc[1]}' in request body.`,
          });
        } else {
          setMessage({ type: "error", text: `Login Failed: ${detail}` });
        }
      } else {
        // Network error (server unreachable)
        setMessage({
          type: "error",
          text: `Could not connect to API at ${API_BASE_URL}. Check your server status.`,
        });
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Custom styled Message Box
  const Message = ({ type, text }) => {
    let bgColor, textColor, Icon;
    switch (type) {
      case "error":
        bgColor = "bg-red-600/90";
        textColor = "text-white";
        Icon = () => <Power className="h-5 w-5" />;
        break;
      case "success":
        bgColor = "bg-green-600/90";
        textColor = "text-white";
        Icon = () => <LogIn className="h-5 w-5" />;
        break;
      case "info":
        bgColor = "bg-blue-600/90";
        textColor = "text-white";
        Icon = () => <User className="h-5 w-5" />;
        break;
      default:
        return null;
    }

    return (
      <div
        className={`p-3 mb-4 rounded-xl text-sm font-medium flex items-center shadow-lg ${bgColor} ${textColor}`}
      >
        <Icon />
        <span className="ml-3">{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900/95 flex flex-col items-center justify-start font-sans relative p-4">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 opacity-60"></div>

      <div className="relative z-10 bg-gray-800/70 mt-16 w-full max-w-md rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-purple-700/50">
        <h2 className="text-4xl font-extrabold text-white text-center tracking-tight mb-2">
          {accessToken ? "Welcome Back" : "User Login"}
        </h2>
        <p className="text-gray-300 text-base mb-6 text-center">
          {accessToken ? "Token is active." : "Log in to access your account."}
        </p>

        {/* Message Box */}
        {message && <Message type={message.type} text={message.text} />}

        <>
          {/* Mobile Number Input */}
          <label className="text-sm font-semibold text-gray-300 block mb-1">
            Mobile Number
          </label>
          <div className="relative mt-1 mb-4">
            <input
              type="tel"
              placeholder="Enter 10-digit Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={10}
              className="w-full border border-purple-500/50 rounded-xl px-12 py-3 text-base focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-gray-700/50 text-white placeholder-gray-400 transition"
            />
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs bg-gray-700/50 px-2 py-0.5 rounded-full">
              {mobile.length} / 10
            </span>
          </div>

          {/* Password Input */}
          <label className="text-sm font-semibold text-gray-300 block mb-1">
            Password
          </label>
          <div className="relative mt-1 mb-6">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-purple-500/50 rounded-xl px-12 py-3 text-base focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-gray-700/50 text-white placeholder-gray-400 transition"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 text-white px-4 py-3 text-base rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold shadow-xl shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login
              </>
            )}
          </button>

          {/* Registration Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-purple-400 font-semibold hover:text-purple-300 transition"
            >
              Register Now
            </a>
          </p>
        </>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 text-center mt-8 text-sm text-gray-400">
        <p>Support Contact:</p>
        <div className="flex items-center justify-center mt-2">
          <span className="text-green-400 text-xl mr-2">💬</span>
          <a
            href="https://wa.me/917726035987"
            className="text-green-400 font-semibold hover:text-green-300 transition"
          >
            +91 7726035987 (WhatsApp)
          </a>
        </div>
      </div>
    </div>
  );
}
