import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { useTranslation } from "react-i18next"; // i18n සඳහා එකතු කරන ලදී

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [initials, setInitials] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const { t, i18n } = useTranslation(); // භාෂා පරිවර්තන හූක් එක

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInitials(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserInitials = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/passengers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.fullName) {
        const words = response.data.fullName.trim().split(" ");
        if (words.length >= 2) {
          const init = (words[0][0] + words[1][0]).toUpperCase();
          setInitials(init);
        } else if (words.length === 1) {
          const init = words[0].substring(0, 2).toUpperCase();
          setInitials(init);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user initials for navbar", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setInitials("");
    navigate("/");
  };

  // භාෂාව මාරු කිරීම සඳහා
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-green-100 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/logo.png" 
            alt="eBus Lanka Logo" 
            className="w-full h-full object-contain p-1" 
          />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          <span className="text-green-600">e</span>Bus Lanka
        </h1>
      </Link>

      {/* Center Navigation Links */}
      <div className="hidden md:flex gap-8 font-medium text-gray-600 items-center">
        <Link to="/" className="hover:text-green-600 transition duration-300">{t("nav_home")}</Link>
        <Link to="/about" className="hover:text-green-600 transition duration-300">{t("nav_about")}</Link>
        <Link to="/contact" className="hover:text-green-600 transition duration-300">{t("nav_contact")}</Link>

        {isLoggedIn && (
          <>
            <Link to="/find-bus" className="hover:text-green-600 transition duration-300 font-semibold text-gray-600">
              {t("nav_buses")}
            </Link>
            <Link to="/passenger-reservations" className="hover:text-green-600 transition duration-300 font-semibold text-gray-600">
              {t("nav_bookings")}
            </Link>
            <Link to="/passenger-reviews" className="hover:text-green-600 transition duration-300 font-semibold text-gray-600">
              {t("nav_reviews")}
            </Link>
          </>
        )}
      </div>

      {/* Right Side - Language Selector & Dynamic Buttons */}
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <select 
          onChange={changeLanguage} 
          defaultValue={i18n.language} 
          className="bg-white text-gray-700 font-semibold text-sm px-3 py-2 rounded-full border border-green-300 shadow-sm focus:outline-none cursor-pointer hover:border-green-500 transition"
        >
          <option value="en">English</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("nav_logout")}
            </button>
            
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              title="My Profile" 
              className="focus:outline-none flex items-center gap-2 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full border border-green-300 shadow-sm transition-all duration-300 group"
            >
              <div className="relative flex items-center justify-center">
                <FaUserCircle className="text-3xl text-green-600 group-hover:text-green-700 transition" />
              </div>
              {initials && (
                <span className="font-extrabold text-green-800 text-xs tracking-wider bg-green-100 px-2 py-0.5 rounded-full">
                  {initials}
                </span>
              )}
            </button>
          </div>
        ) : (
          <Link to="/choose-signup">
            <button className="px-6 py-2 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              {t("nav_signup")}
            </button>
          </Link>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      
    </nav>
  );
}