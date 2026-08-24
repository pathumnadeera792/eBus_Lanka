import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSyncAlt } from "react-icons/fa";

// Import Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BusCard from "../components/BusCard";

export default function FindBusPage() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // State for search form
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: ""
  });

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "passenger") {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    const fetchApprovedBuses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/operators/buses/approved`);
        if (Array.isArray(response.data)) {
          setBuses(response.data);
          setFilteredBuses(response.data);
        }
      } catch (error) {
        toast.error("Failed to load available buses");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedBuses();
  }, [navigate, backendUrl]);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  // Smart Advanced Search & Filter Logic
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);

    if (!searchData.from || !searchData.to || !searchData.date) {
      toast.error("Please fill all search fields");
      return;
    }

    // 1. Get exact day name from the selected date (e.g., "Sunday", "Monday")
    const selectedDateObj = new Date(searchData.date);
    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g., "sunday"

    const results = buses.filter(bus => {
      // Check From (Departure Location)
      const matchFrom = bus.departureLocation.toLowerCase().includes(searchData.from.toLowerCase());
      
      // Check To (Destination or Route)
      const matchDestination = bus.destination ? bus.destination.toLowerCase().includes(searchData.to.toLowerCase()) : false;
      const matchRoute = bus.routeNo.toLowerCase().includes(searchData.to.toLowerCase()) || bus.busName.toLowerCase().includes(searchData.to.toLowerCase());
      const matchTo = matchDestination || matchRoute;

      // Check Schedule / Dates (Array of strings like ["Daily", "Sunday", "2026-08-31"])
      let matchDate = false;
      if (Array.isArray(bus.departureDates)) {
        matchDate = bus.departureDates.some(schedule => {
          const schedLower = schedule.toLowerCase();
          const isDaily = schedLower.includes("daily");
          const isDayMatch = schedLower.includes(dayName); // Matches "sunday", "monday", etc.
          const isExactDateMatch = schedLower.includes(searchData.date); // Matches exact "2026-08-31"

          return isDaily || isDayMatch || isExactDateMatch;
        });
      }

      return matchFrom && matchTo && matchDate;
    });

    setFilteredBuses(results);

    if (results.length > 0) {
      toast.success(`${results.length} bus(es) found!`);
    } else {
      toast.error("No buses found for this route and date.");
    }
  };

  // Clear Filter Function
  const handleClearFilter = () => {
    setSearchData({ from: "", to: "", date: "" });
    setFilteredBuses(buses);
    setHasSearched(false);
    toast.success("Filters cleared!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Find Bus
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-green-600 inline-block pb-2">
            The Simplest way to book your bus tickets in Sri Lanka
          </h2>
        </div>

        {/* Search Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-16">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end justify-center">
            
            <div className="w-full md:w-1/4">
              <label className="text-gray-700 font-bold mb-2 block">From</label>
              <input 
                type="text"
                name="from" 
                value={searchData.from} 
                onChange={handleChange} 
                placeholder="e.g. Colombo"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-white"
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="text-gray-700 font-bold mb-2 block">To</label>
              <input 
                type="text"
                name="to" 
                value={searchData.to} 
                onChange={handleChange} 
                placeholder="e.g. Kandy"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-white"
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="text-gray-700 font-bold mb-2 block">Journey Date</label>
              <input 
                type="date" 
                name="date" 
                value={searchData.date} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-white"
              />
            </div>

            <div className="w-full md:w-1/4 flex gap-2">
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Find Bus
              </button>
              {hasSearched && (
                <button 
                  type="button"
                  onClick={handleClearFilter}
                  className="bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
                  title="Clear Filter"
                >
                  <FaSyncAlt />
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Results Section */}
        <div>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600 font-semibold text-lg">Loading available buses...</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-gray-500">No approved buses available for this route and date.</h3>
              <p className="text-gray-400 mt-2">Try searching for a different route or clear filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuses.map((bus) => (
                <BusCard key={bus._id} bus={bus} />
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}