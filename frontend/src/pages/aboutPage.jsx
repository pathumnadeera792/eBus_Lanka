import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBullseye, FaLightbulb, FaShieldAlt, FaUsers } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section for About Page */}
      <div 
        className="relative w-full h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {t("about_hero_title")} <span className="text-green-500">e</span>Bus Lanka
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            {t("about_hero_desc")}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex-grow space-y-20">
        
        {/* 1. Who We Are Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
              {t("who_we_are_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t("who_we_are_p1")}
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t("who_we_are_p2")}
            </p>
          </div>
          <div>
            <img 
              src="/home-second-busimage.png" 
              alt="eBus Lanka Service" 
              className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        </div>

        {/* 2. Mission & Vision Section (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:border-green-300 transition-colors duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <FaBullseye className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("mission_title")}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t("mission_desc")}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:border-green-300 transition-colors duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <FaLightbulb className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("vision_title")}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t("vision_desc")}
            </p>
          </div>
        </div>

        {/* 3. Core Values Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("why_choose_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-green-500">
              <FaUsers className="text-5xl text-gray-700 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t("value_customer_title")}</h4>
              <p className="text-gray-600">{t("value_customer_desc")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-green-500">
              <FaShieldAlt className="text-5xl text-gray-700 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t("value_secure_title")}</h4>
              <p className="text-gray-600">{t("value_secure_desc")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-green-500">
              <FaLightbulb className="text-5xl text-gray-700 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">{t("value_innovation_title")}</h4>
              <p className="text-gray-600">{t("value_innovation_desc")}</p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}