import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BusCard from "../components/BusCard";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Import Icons
import { FaSuitcaseRolling, FaPhoneAlt, FaDollarSign, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export default function HomePage() {
  const form = useRef();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [approvedBuses, setApprovedBuses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchApprovedBuses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/operators/buses/approved`);
        if (Array.isArray(response.data)) {
          setApprovedBuses(response.data.slice(0, 3)); 
        }
      } catch (error) {
        console.error("Failed to fetch approved buses for home page", error);
      }
    };

    fetchApprovedBuses();
  }, [backendUrl]);

  const handleViewAllBuses = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "passenger") {
      toast.error(t("toast_login_required"));
      navigate("/login");
      return;
    }
    navigate("/find-bus");
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const SERVICE_ID = "service_9msb6a7"; 
    const TEMPLATE_ID = "template_ofi337c";
    const PUBLIC_KEY = "AEBOvunVgqsrVWHgI";

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
      toast.success(t("toast_msg_success"));
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(t("toast_msg_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* 1. Hero Section */}
      <div 
        className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl">
            {t("hero_title_1")} <br /> <span className="text-green-400">{t("hero_title_2")}</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            {t("hero_desc")}
          </p>
          
          {isLoggedIn ? (
            <Link to="/find-bus">
              <button className="px-10 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 hover:shadow-[0_10px_20px_rgba(22,163,74,0.4)] hover:-translate-y-1 transition-all duration-300">
                {t("hero_btn_explore")}
              </button>
            </Link>
          ) : (
            <Link to="/choose-login">
              <button className="px-10 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 hover:shadow-[0_10px_20px_rgba(22,163,74,0.4)] hover:-translate-y-1 transition-all duration-300">
                {t("hero_btn_login")}
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-28 flex-grow">
        
        {/* 2. About Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center bg-green-100 p-8 md:p-12 rounded-3xl shadow-xl border border-green-400">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {t("about_heading_1")} <br /> <span className="text-green-800">{t("about_heading_2")}</span>
            </h2>
            <h3 className="text-gray-800 font-semibold text-lg border-l-4 border-green-700 pl-4">
              {t("about_subheading")}
            </h3>
            <p className="text-gray-800 font-medium leading-relaxed">
              {t("about_p1")}
            </p>
            <p className="text-gray-800 font-medium leading-relaxed">
              {t("about_p2")}
            </p>
          </div>
          <div className="md:w-1/2 relative group">
            <div className="absolute -inset-2 bg-green-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <img 
              src="/home-second-busimage.png" 
              alt="Luxury Bus" 
              className="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 transform group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* 3. Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { count: "1500+", label: t("stat_passengers") },
            { count: "350+", label: t("stat_buses") },
            { count: "50+", label: t("stat_staff") },
            { count: "100+", label: t("stat_routes") }
          ].map((stat, index) => (
            <div key={index} className="bg-green-100 text-center py-10 rounded-2xl shadow-lg border-b-4 border-green-700 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">{stat.count}</h3>
              <p className="text-green-900 font-extrabold uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 4. Why Book With Us Section */}
        <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row border border-gray-200">
          <div className="md:w-1/3 p-10 flex flex-col justify-center bg-gray-900 text-white">
            <h2 className="text-3xl font-bold mb-6 text-green-400">{t("why_title")}</h2>
            <p className="leading-relaxed opacity-90 text-lg">
              {t("why_desc")}
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-100">
            <div className="bg-green-100 p-8 rounded-2xl text-center flex flex-col items-center justify-center hover:bg-green-400 transition-colors shadow-md">
              <FaSuitcaseRolling className="text-5xl text-green-900 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{t("why_choice_title")}</h3>
              <p className="text-gray-800 font-medium text-sm">{t("why_choice_desc")}</p>
            </div>
            <div className="bg-green-100 p-8 rounded-2xl text-center flex flex-col items-center justify-center hover:bg-green-400 transition-colors shadow-md">
              <FaPhoneAlt className="text-5xl text-green-900 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{t("why_support_title")}</h3>
              <p className="text-gray-800 font-medium text-sm">{t("why_support_desc")}</p>
            </div>
            <div className="bg-green-100 p-8 rounded-2xl text-center flex flex-col items-center justify-center hover:bg-green-400 transition-colors shadow-md">
              <FaDollarSign className="text-5xl text-green-900 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{t("why_price_title")}</h3>
              <p className="text-gray-800 font-medium text-sm">{t("why_price_desc")}</p>
            </div>
          </div>
        </div>

        {/* 5. Available Buses Section */}
        <div className="bg-green-100 p-10 rounded-3xl shadow-xl border border-green-400">
          <div className="text-center mb-12">
            <h4 className="text-green-900 font-extrabold uppercase tracking-wider text-sm mb-2">{t("fleet_subtitle")}</h4>
            <h2 className="text-4xl font-bold text-gray-900">{t("fleet_title")}</h2>
            <div className="w-24 h-1 bg-green-700 mx-auto mt-4 rounded-full"></div>
          </div>
          
          {approvedBuses.length === 0 ? (
            <div className="text-center py-8 text-gray-700 font-medium">{t("no_buses_msg")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedBuses.map((bus) => (
                <BusCard key={bus._id} bus={bus} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllBuses}
              className="bg-gray-900 text-white px-10 py-3 rounded-full font-bold hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("btn_view_all_buses")}
            </button>
          </div>
        </div>

        {/* 6. Contact Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
          
          {/* Contact Info (Left Side) */}
          <div className="md:w-5/12 bg-gray-900 text-white p-10 flex flex-col justify-center">
            <h4 className="text-green-500 font-bold uppercase tracking-wider text-sm mb-2">{t("contact_tag")}</h4>
            <h2 className="text-4xl font-bold mb-10">{t("contact_title")}</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaMapMarkerAlt className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t("contact_location_title")}</h4>
                  <p className="text-gray-400 mt-1">{t("contact_location_val")}</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaEnvelope className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t("contact_email_title")}</h4>
                  <p className="text-gray-400 mt-1">info@ebuslanka.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaPhoneAlt className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t("contact_call_title")}</h4>
                  <p className="text-gray-400 mt-1">+94 774299871</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="md:w-7/12 p-10 md:p-14 bg-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t("form_title")}</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="user_name" placeholder={t("form_name")} required className="w-full p-4 bg-white shadow-sm border border-transparent rounded-xl outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                <input type="email" name="user_email" placeholder={t("form_email")} required className="w-full p-4 bg-white shadow-sm border border-transparent rounded-xl outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
              </div>
              <input type="text" name="subject" placeholder={t("form_subject")} required className="w-full p-4 bg-white shadow-sm border border-transparent rounded-xl outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
              <textarea name="message" placeholder={t("form_message")} rows="5" required className="w-full p-4 bg-white shadow-sm border border-transparent rounded-xl outline-none focus:border-green-600 focus:shadow-md transition-all resize-none text-gray-800"></textarea>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md ${isLoading ? "bg-gray-500" : "bg-gray-900 hover:bg-black hover:shadow-xl hover:-translate-y-0.5"}`}
              >
                {isLoading ? t("form_sending") : t("form_send_btn")}
              </button>
            </form>
          </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
}