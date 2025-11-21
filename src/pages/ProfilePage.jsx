import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ProfilePage() {
  const user = {
    username: "Abhay",
    mobile: "912332323",
    email: "abha@gmail.com",
  };

  return (
    <div className="min-h-screen mx-auto max-w-md flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        {/* <button className="absolute left-4">
          <ArrowLeft size={22} className="text-white" />
        </button> */}
        <h1 className="text-lg font-semibold">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className=" w-[90%] bg-white/10 shadow-xl max-w-md mt-6 rounded-2xl p-6 relative">
        {/* Edit Button */}
        <button className="absolute top-4 right-4 flex items-center text-sm text-gray-200 hover:text-purple-700">
          <Pencil size={16} className="mr-1" />
          Edit Profile
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-yello-400 border  text-white flex items-center justify-center text-4xl font-bold rounded-full shadow-md mb-4">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">
              Username
            </label>
            <p className="text-gray-200 font-semibold border-b pb-1">
              {user.username}
            </p>
            w
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">
              Mobile
            </label>
            <p className="text-gray-200 font-semibold border-b pb-1">
              {user.mobile}
            </p>
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">
              Email
            </label>
            <p className="text-gray-200 font-semibold border-b pb-1">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Pencil, Check, X } from "lucide-react";

// // --- CONFIGURATION ---
// // IMPORTANT: Replace this with your actual backend URL

// // Helper function for making authenticated API calls
// const authenticatedFetch = async (url, options = {}) => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     throw new Error("User not authenticated. Please log in.");
//   }

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//     ...options.headers,
//   };

//   const response = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const errorBody = await response
//       .json()
//       .catch(() => ({ detail: "Unknown error" }));
//     throw new Error(
//       `HTTP error ${response.status}: ${
//         errorBody.detail || "Failed to process request"
//       }`
//     );
//   }

//   return response.json();
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // State for editable fields: only 'username' is allowed by the backend's UserUpdate schema
//   const [formData, setFormData] = useState({
//     username: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [statusMessage, setStatusMessage] = useState({
//     type: null,
//     text: null,
//   });

//   // 1. Function to Fetch User Profile Data
//   const fetchUserProfile = async () => {
//     setLoading(true);
//     setStatusMessage({ type: null, text: null });
//     try {
//       const userData = await authenticatedFetch(`${API_BASE_URL}/users/me`);
//       setUser(userData);
//       // Initialize form data with the current editable user data
//       setFormData({
//         username: userData.username,
//       });
//     } catch (err) {
//       console.error("Failed to fetch user profile:", err);
//       setStatusMessage({
//         type: "error",
//         text: err.message || "Failed to load profile data.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   // 2. Handle form input changes
//   const handleChange = (e) => {
//     // We only expect 'username' changes
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // 3. Function to Update User Profile Data (PATCH /users/me)
//   const handleUpdateProfile = async () => {
//     setStatusMessage({ type: null, text: null });

//     // The payload strictly adheres to the backend's UserUpdate schema
//     const updatePayload = {
//       username: formData.username,
//     };

//     // Simple validation
//     if (updatePayload.username.length < 3) {
//       setStatusMessage({
//         type: "error",
//         text: "Username must be at least 3 characters long.",
//       });
//       return;
//     }

//     try {
//       const updatedUser = await authenticatedFetch(`${API_BASE_URL}/users/me`, {
//         method: "PATCH",
//         body: JSON.stringify(updatePayload),
//       });

//       setUser(updatedUser);
//       setIsEditing(false);
//       setStatusMessage({
//         type: "success",
//         text: "Profile updated successfully!",
//       });
//     } catch (err) {
//       console.error("Failed to update user profile:", err);
//       setStatusMessage({
//         type: "error",
//         text:
//           err.message || "Failed to update profile. Check console for details.",
//       });
//     }
//   };

//   if (loading || user === null) {
//     return (
//       <div className="min-h-screen mx-auto max-w-md flex flex-col items-center justify-center text-white">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
//         <p className="mt-4">Loading profile...</p>
//       </div>
//     );
//   }

//   // Determine message styling
//   const messageClass =
//     statusMessage.type === "error"
//       ? "bg-red-500 text-white"
//       : statusMessage.type === "success"
//       ? "bg-green-500 text-white"
//       : "hidden";

//   return (
//     <div className="min-h-screen mx-auto max-w-md flex flex-col items-center p-4">
//       {/* Header */}
//       <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative">
//         <h1 className="text-lg font-semibold">My Profile</h1>
//       </div>

//       {/* Status Message */}
//       {statusMessage.text && (
//         <div
//           className={`w-[90%] p-3 mb-4 rounded-lg text-center font-medium ${messageClass}`}
//         >
//           {statusMessage.text}
//         </div>
//       )}

//       {/* Profile Card */}
//       <div className=" w-[90%] bg-white/10 backdrop-blur-sm shadow-2xl max-w-md mt-2 rounded-2xl p-6 relative text-white">
//         {/* Edit/Save/Cancel Buttons */}
//         <div className="absolute top-4 right-4 z-10">
//           {isEditing ? (
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleUpdateProfile}
//                 className="flex items-center text-sm text-green-400 hover:text-green-600 transition duration-150"
//                 title="Save"
//               >
//                 <Check size={18} className="mr-1" />
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setIsEditing(false);
//                   // Reset form data to current user data on cancel
//                   setFormData({
//                     username: user.username,
//                   });
//                   setStatusMessage({ type: null, text: null });
//                 }}
//                 className="flex items-center text-sm text-red-400 hover:text-red-600 transition duration-150"
//                 title="Cancel"
//               >
//                 <X size={18} className="mr-1" />
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="flex items-center text-sm text-gray-200 hover:text-purple-400 transition duration-150"
//             >
//               <Pencil size={16} className="mr-1" />
//               Edit Profile
//             </button>
//           )}
//         </div>

//         {/* Avatar */}
//         <div className="flex flex-col items-center">
//           <div className="w-24 h-24 bg-purple-600 border-2 border-purple-300 text-white flex items-center justify-center text-4xl font-bold rounded-full shadow-lg mb-4">
//             {user?.username.charAt(0).toUpperCase()}
//           </div>
//           <p className="text-xl font-bold text-yellow-400 mb-4">
//             Balance: ₹{user.balance.toFixed(2)}
//           </p>
//         </div>

//         {/* User Info / Edit Form */}
//         <div className="space-y-4 mt-4">
//           {/* Username */}
//           <div className="p-2 border border-gray-600 rounded-lg">
//             <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
//               Username
//             </label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full bg-transparent text-white font-semibold pb-1 focus:outline-none focus:text-purple-300"
//               />
//             ) : (
//               <p className="text-gray-100 font-semibold">{user.username}</p>
//             )}
//           </div>

//           {/* Mobile (Read-Only) */}
//           <div className="p-2 border border-gray-600 rounded-lg bg-white/5">
//             <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
//               Mobile (Cannot be changed here)
//             </label>
//             <p className="text-gray-300 font-semibold">{user.mobile}</p>
//           </div>

//           {/* User Role */}
//           <div className="p-2 border border-gray-600 rounded-lg">
//             <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
//               Role
//             </label>
//             <p
//               className={`font-semibold capitalize ${
//                 user.role === "admin" ? "text-red-400" : "text-green-400"
//               }`}
//             >
//               {user.role}
//             </p>
//           </div>

//           {/* Creation Date */}
//           <div className="text-center pt-4 border-t border-gray-700 mt-6">
//             <p className="text-gray-500 text-xs">
//               Account created: {new Date(user.created_at).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
