import React from "react";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { FaW, FaWhatsapp } from "react-icons/fa6";

export default function ContactUs() {
  return (
    <div className="max-w-md mx-auto min-h-screen font-sans">
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 flex items-center justify-center relative  ">
        <h1 className="text-xl font-semibold">Contact Us</h1>
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-3 text-sm">
        {/* WhatsApp */}
        <div className="bg-white/20  rounded-xl p-3 shadow flex items-center gap-4">
          {/* <img
            src={whatsappLogo}
            alt="whatsapp"
            className="w-10 h-10 rounded-full"
          /> */}
          <FaWhatsapp size={30} color="#25D366" />
          <div>
            <p className="text-gray-200 font-semibold">Chat Us:</p>
            <p className="text-gray-200">+919509397414</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white/20 rounded-xl p-3 shadow flex items-center gap-4">
          <Mail size={30} color="red" />
          <div>
            <p className="text-gray-200 font-semibold">Email Us:</p>
            <p className="text-gray-200">df@gmail.com</p>
          </div>
        </div>

        {/* Call */}
        <div className="bg-white/20  rounded-xl p-3 shadow flex items-center gap-4">
          <Phone size={30} color="#7e13ca" />
          <div>
            <p className="text-gray-200 font-semibold">Call Us:</p>
            <p className="text-gray-200">+919509397414</p>
          </div>
        </div>
      </div>
    </div>
  );
}
