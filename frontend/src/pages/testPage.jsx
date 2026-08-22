import {use, useState} from "react";

export default function TestPage() {
    let [count, setCount] = useState(0); //react hook to create a state variable called count and a function called setCount to update the value of count. The initial value of count is set to 0.

    function increment() {
        setCount(count + 1);//setCount is a function that updates the value of count. It takes the current value of count and adds 1 to it, then sets the new value of count to the result.
    }

    function decrement() {
        setCount(count - 1);//setCount is a function that updates the value of count. It takes the current value of count and subtracts 1 from it, then sets the new value of count to the result.
    }



  return (
    <div className = " w-full h-screen bg-ye flex justify-center items-center">
      <div className = "w-[400px] h-[400px] bg-white flex flex-col justify-evenly items-center ">
        <h1 className="text-7xl font-bold">{count}</h1>
        <div className="w-full flex justify-center items-center h-[100px]">
        
        <button className="w-[100px] h-[45px]  hover:bg-red-700 bg-red-600 rounded-full mx-2 flex justify-center items-center text-white text-3xl font-bold" onClick={decrement}>
          -
        </button>
        <button className="w-[100px] h-[45px] hover:bg-blue-700 bg-blue-600 rounded-full mx-2  flex justify-center items-center text-white text-3xl font-bold" onClick={increment}>
          +
        </button>
        
        </div>
        
      </div>
    </div>
  )
}




import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BusCard from "../components/BusCard";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

// Import Icons
import { FaSuitcaseRolling, FaPhoneAlt, FaDollarSign, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export default function HomePage() {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy data for buses
  const dummyBuses = [
    { id: 1, numberPlate: "WP NP 1267", price: "1500", name: "Super Line", seats: 51, route: "Colombo - Kandy", date: "Sunday", time: "08:00 AM", type: "AC" },
    { id: 2, numberPlate: "WP ND 4589", price: "1500", name: "Super Line", seats: 45, route: "Colombo - Kandy", date: "Sunday", time: "08:30 AM", type: "AC" },
    { id: 3, numberPlate: "WP NA 7823", price: "1500", name: "Super Line", seats: 51, route: "Colombo - Kandy", date: "Sunday", time: "09:00 AM", type: "AC" },
  ];

  // Function to send email from Home Page
  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const SERVICE_ID = "service_9msb6a7"; 
    const TEMPLATE_ID = "template_ofi337c";
    const PUBLIC_KEY = "AEBOvunVgqsrVWHgI";

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
      toast.success("Message sent successfully!");
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send the message. Please try again.");
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
            Book Your Ticket <br /> <span className="text-green-400">Enjoy Your Journey</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Sri Lanka's Pioneer and Number One Online Bus Ticket Booking Platform.
          </p>
          <Link to="/choose-login">
            <button className="px-10 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 hover:shadow-[0_10px_20px_rgba(22,163,74,0.4)] hover:-translate-y-1 transition-all duration-300">
              Login to Continue
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-28 flex-grow">
        
        {/* 2. About Section - Added subtle green gradient and stronger shadow */}
        <div className="flex bg-green-300 flex-col md:flex-row gap-12 items-center bg-gradient-to-br from-white to-green-50/50 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-green-100/50">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              eBus Lanka Made Easy <br /> <span className="text-green-600">and Efficient</span>
            </h2>
            <h3 className="text-gray-500 font-semibold text-lg border-l-4 border-green-500 pl-4">
              Plan journey, Reserve bus seats, Reach destination.
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We provide a full-fledged online bus booking platform to buy and sell bus seats. Passengers can purchase bus tickets online and receive instant confirmation via text message.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With our efficient reservation system, plan your journey early, save your valuable time, avoid waiting in long queues, and enjoy your happy journey with comfort.
            </p>
          </div>
          <div className="md:w-1/2 relative group">
            {/* Added a subtle glow effect behind the image */}
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <img 
              src="/home-second-busimage.png" 
              alt="Luxury Bus" 
              className="relative w-full rounded-2xl shadow-xl transition-transform duration-500 transform group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* 3. Stats Section - Added gradient and stronger hover effect */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          {[
            { count: "1500+", label: "Passengers" },
            { count: "350+", label: "Buses" },
            { count: "50+", label: "Staff" },
            { count: "100+", label: "Routes" }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-b from-white to-gray-50 text-center py-10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border-b-4 border-green-500 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgb(0,0,0,0.1)] transition-all duration-300 ">
              <h3 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">{stat.count}</h3>
              <p className="text-green-600 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 4. Why Book With Us Section */}
        <div className="bg-green-600 text-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.15)] flex flex-col md:flex-row">
          <div className="md:w-1/3 p-10 flex flex-col justify-center bg-green-700">
            <h2 className="text-3xl font-bold mb-6">Why Book with eBus Lanka?</h2>
            <p className="leading-relaxed opacity-90 text-lg">
              To provide the public a safe, dependable and comfortable road passenger transport through a dedicated staff.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-gray-200">
            {/* Added subtle gradient to the inner white cards */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <FaSuitcaseRolling className="text-5xl text-green-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2 text-lg">More Choices</h3>
              <p className="text-gray-500 text-sm">Maximum choices across all routes.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <FaPhoneAlt className="text-5xl text-green-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2 text-lg">24/7 Support</h3>
              <p className="text-gray-500 text-sm">We help make your journey better.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <FaDollarSign className="text-5xl text-green-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2 text-lg">Best Price</h3>
              <p className="text-gray-500 text-sm">Always offer the best ticket prices.</p>
            </div>
          </div>
        </div>

        {/* 5. Available Buses Section - Added nice drop shadow and subtle background */}
        <div className="bg-gradient-to-b from-white to-gray-50/80 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="text-center mb-12">
            <h4 className="text-green-600 font-bold uppercase tracking-wider text-sm mb-2">Our Fleet</h4>
            <h2 className="text-4xl font-bold text-gray-800">Available Busses</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyBuses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gray-800 text-white px-10 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              View All Busses
            </button>
          </div>
        </div>

        {/* 6. Contact Section - Enhanced form background area */}
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
          
          {/* Contact Info (Left Side) */}
          <div className="md:w-5/12 bg-gray-900 text-white p-10 flex flex-col justify-center">
            <h4 className="text-green-500 font-bold uppercase tracking-wider text-sm mb-2">Contact</h4>
            <h2 className="text-4xl font-bold mb-10">Get In Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaMapMarkerAlt className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Location</h4>
                  <p className="text-gray-400 mt-1">No 123, Main Road, Colombo 01</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaEnvelope className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email</h4>
                  <p className="text-gray-400 mt-1">info@ebuslanka.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30">
                  <FaPhoneAlt className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Call Us</h4>
                  <p className="text-gray-400 mt-1">+94 774299871</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side) - Added light green tint to background */}
          <div className="md:w-7/12 p-10 md:p-14 bg-gradient-to-bl from-white to-green-50/30">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Send a Message</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="user_name" placeholder="Your Name" required className="w-full p-4 bg-white shadow-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:shadow-md transition-all" />
                <input type="email" name="user_email" placeholder="Your Email" required className="w-full p-4 bg-white shadow-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:shadow-md transition-all" />
              </div>
              <input type="text" name="subject" placeholder="Subject" required className="w-full p-4 bg-white shadow-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:shadow-md transition-all" />
              <textarea name="message" placeholder="Message" rows="5" required className="w-full p-4 bg-white shadow-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:shadow-md transition-all resize-none"></textarea>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 hover:shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:-translate-y-0.5"}`}
              >
                {isLoading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}