import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BusCard from "../components/BusCard"; // Using the BusCard we created earlier

export default function FindBusPage() {
  const navigate = useNavigate();
  
  // State for search form
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: ""
  });

  // State to hold buses (Initially dummy data, later fetched from DB)
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "passenger") {
      toast.error("Please login to access this page");
      navigate("/login");
    }

    // Dummy data for now (Since operator part is not done yet)
    const dummyBuses = [
      { id: 1, numberPlate: "WP NP 1267", price: "1500", name: "Super Line", seats: 51, route: "Colombo - Kandy", date: "2026-08-25", time: "08:00 AM", type: "AC", from: "Colombo", to: "Kandy" },
      { id: 2, numberPlate: "WP ND 4589", price: "2500", name: "Super Line", seats: 45, route: "Colombo - Jaffna", date: "2026-08-26", time: "08:30 AM", type: "AC", from: "Colombo", to: "Jaffna" },
      { id: 3, numberPlate: "WP NA 7823", price: "1200", name: "Super Line", seats: 51, route: "Kandy - Colombo", date: "2026-08-25", time: "09:00 AM", type: "AC", from: "Kandy", to: "Colombo" },
      { id: 4, numberPlate: "WP NC 1122", price: "2500", name: "Northern Star", seats: 40, route: "Colombo - Jaffna", date: "2026-08-26", time: "10:00 PM", type: "Super Luxury", from: "Colombo", to: "Jaffna" },
    ];
    
    setBuses(dummyBuses);
    setFilteredBuses(dummyBuses); // Show all initially
  }, [navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Search Function
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);

    if (!searchData.from || !searchData.to || !searchData.date) {
      toast.error("Please fill all search fields");
      return;
    }

    // Filter logic based on dummy data
    const results = buses.filter(bus => 
      bus.from.toLowerCase() === searchData.from.toLowerCase() &&
      bus.to.toLowerCase() === searchData.to.toLowerCase() &&
      bus.date === searchData.date
    );

    setFilteredBuses(results);

    if (results.length > 0) {
      toast.success(`${results.length} bus(es) found!`);
    } else {
      toast.error("No buses found for this route and date.");
    }
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
        
        {/* Search Header */}
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
              <select 
                name="from" 
                value={searchData.from} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="">Select City</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Galle">Galle</option>
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label className="text-gray-700 font-bold mb-2 block">To</label>
              <select 
                name="to" 
                value={searchData.to} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="">Select City</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Galle">Galle</option>
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label className="text-gray-700 font-bold mb-2 block">Journey Date</label>
              <input 
                type="date" 
                name="date" 
                value={searchData.date} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>

            <div className="w-full md:w-1/4">
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Find Bus
              </button>
            </div>

          </form>
        </div>

        {/* Results Section */}
        <div>
          {hasSearched && filteredBuses.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-gray-500">No buses available for this route and date.</h3>
              <p className="text-gray-400 mt-2">Try searching for a different date or route.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}