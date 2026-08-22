import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import Icons for the cards
import { FaUserCircle, FaBus } from "react-icons/fa";

export default function ChooseLoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section for Choose Login */}
      <div 
        className="relative w-full h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }} // Ensure this image is in the public folder
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Dark overlay */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Login Your Account
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium drop-shadow-md">
            Please select your account type to continue
          </p>
        </div>
      </div>

      {/* Account Type Selection Cards */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-10 py-16 px-4">
        
        {/* Card 1: Passenger */}
        <Link 
          to="/login" 
          className="bg-green-300 w-full max-w-sm p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.3)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-green-400 group"
        >
          {/* Icon with slight animation on hover */}
          <FaUserCircle className="text-9xl mb-8 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
          
          <div className="bg-gray-900 text-white font-bold py-2 px-10 rounded-full mb-6 text-xl shadow-md group-hover:bg-black transition-colors">
            Passenger
          </div>
          
          <p className="text-gray-900 font-bold text-lg">
            Book tickets and manage trips
          </p>
        </Link>

        {/* Card 2: Bus Operator */}
        <Link 
          to="/operator-login" 
          className="bg-green-300 w-full max-w-sm p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.3)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-green-400 group"
        >
          {/* Icon with slight animation on hover */}
          <FaBus className="text-9xl mb-8 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
          
          <div className="bg-gray-900 text-white font-bold py-2 px-10 rounded-full mb-6 text-xl shadow-md group-hover:bg-black transition-colors">
            Bus Operator
          </div>
          
          <p className="text-gray-900 font-bold text-lg">
            Add bus and manage booking
          </p>
        </Link>

      </div>

      <Footer />
    </div>
  );
}