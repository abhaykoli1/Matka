import React, { useState } from "react";
import { Bold, MoreVertical } from "lucide-react";

export default function HowToPlay() {
  const [content, setContent] = useState("Hello\nGuys.\nDownload now\nTHIS");
  const [videoId, setVideoId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Content Saved Successfully!");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex justify-center">
      <div className=" bg-white/20  shadow  w-full max-w-lg">
        <h3 className="text-lg p-4  bg-gradient-to-b from-black to-black/0 font-semibold text-gray-200 ">
          How to Play Content
        </h3>
        <div className="px-4">
          {/* Toolbar */}
          <div className="border  rounded-t-md flex items-center justify-between px-3 py-2 bg-gray-50">
            <select className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="border rounded px-2 py-1 bg-white hover:bg-gray-100">
                <Bold size={16} />
              </button>
              <button className="border rounded px-2 py-1 bg-white hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Text Editor Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-t-0 rounded-b-md w-full h-48 p-3 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
          />

          {/* YouTube Input */}
          <div className="mt-5">
            <label className="block text-sm text-gray-200 mb-1">
              Youtube Video ID (How To Play)
            </label>
            <input
              type="text"
              placeholder="Enter only youtube video ID"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="border rounded-md px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-5 text-right">
            <button
              onClick={handleSubmit}
              className="border w-full text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
