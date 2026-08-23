import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import the profile icon

export default function Navbar() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status when the Navbar loads
  useEffect(() => {
    // Check if a token exists in local storage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    
    // Update state and redirect to home page
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    // Sticky Navbar with glassmorphism effect (stays on top when scrolling)
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-green-100 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      {/* Logo Section (Clickable to go Home) */}
      <Link to="/" className="flex items-center gap-3 group">
        
        {/* Logo Image Container */}
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          {/* Make sure logo.png is in your public folder */}
          <img 
            src="/logo.png" 
            alt="eBus Lanka Logo" 
            className="w-full h-full object-contain p-1" 
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          <span className="text-green-600">e</span>Bus Lanka
        </h1>
      </Link>

      {/* Center Navigation Links (Hidden on mobile screens) */}
      <div className="hidden md:flex gap-8 font-medium text-gray-600">
        <Link to="/" className="hover:text-green-600 transition duration-300">
          Home
        </Link>
        <Link to="/about" className="hover:text-green-600 transition duration-300">
          About
        </Link>
        <Link to="/contact" className="hover:text-green-600 transition duration-300">
          Contact
        </Link>
      </div>

      {/* Right Side - Dynamic Buttons */}
      <div>
        {isLoggedIn ? (
          // If logged in: Show Log Out button and Profile Icon
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Log Out
            </button>
            <Link to="/profile" title="My Profile">
              <FaUserCircle className="text-3xl text-gray-600 hover:text-green-600 transition duration-300" />
            </Link>
          </div>
        ) : (
          // If NOT logged in: Show Sign Up button
          <Link to="/register">
            <button className="px-6 py-2 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        )}
      </div>
      
    </nav>
  );
}