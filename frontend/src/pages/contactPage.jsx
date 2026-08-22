import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

export default function ContactPage() {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // Function to send email
  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // අනිවාර්යයෙන්ම මේවගේ වටේට "" (Quotation marks) තියෙන්න ඕනේ
    const SERVICE_ID = "service_9msb6a7"; 
    const TEMPLATE_ID = "template_ofi337c";
    const PUBLIC_KEY = "AEBOvunVgqsrVWHgI";

    try {
      // API call to EmailJS
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
      
      toast.success("Message sent successfully!");
      form.current.reset(); // Clear the form
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send the message. Please try again.");
    } finally {
      // අනිවාර්යයෙන්ම Loading state එක false වෙනවා
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium">
            We'd love to hear from you. Send us a message!
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-green-500 pl-4 mb-8">
              Get In Touch
            </h2>
            <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 p-4 rounded-full">
                <FaMapMarkerAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Location</h4>
                <p className="text-gray-600">No 123, Main Road, Colombo 01</p>
              </div>
            </div>
            <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 p-4 rounded-full">
                <FaEnvelope className="text-green-600 text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Email</h4>
                <p className="text-gray-600">info@ebuslanka.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 p-4 rounded-full">
                <FaPhoneAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Call Us</h4>
                <p className="text-gray-600">+94 774299871</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* name attribute is important for EmailJS to map data */}
                <input type="text" name="user_name" placeholder="Your Name" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50" />
                <input type="email" name="user_email" placeholder="Your Email" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50" />
              </div>
              <input type="text" name="subject" placeholder="Subject" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50" />
              <textarea name="message" placeholder="Message" rows="5" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50"></textarea>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white px-8 py-3 rounded-lg font-bold transition duration-300 ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}