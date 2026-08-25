import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Import Components
import OperatorSidebar from "../../components/OperatorSidebar";

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [stats, setStats] = useState({
    totalBuses: 0,
    totalSales: 0,
    totalSeatsBooked: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page Protection and Fetching Dashboard Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "operator") {
      toast.error("Please login as Operator");
      navigate("/operator/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/bookings/operator/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats({
          totalBuses: response.data.totalBuses,
          totalSales: response.data.totalSales,
          totalSeatsBooked: response.data.totalSeatsBooked,
        });
        setRecentBookings(response.data.recentBookings);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, backendUrl]);

  // Overview Stats Array mapped from real database stats
  const overviewStats = [
    { title: "Total Buses", value: stats.totalBuses, valueColor: "text-green-600" },
    { title: "Total Sales", value: `LKR ${stats.totalSales.toLocaleString()}`, valueColor: "text-green-600" },
    { title: "Seats Booked", value: stats.totalSeatsBooked, valueColor: "text-green-600" },
  ];

  return (
    <div className="flex min-h-screen bg-green-100 font-sans text-gray-900">
      
      {/* Left Side: Sidebar */}
      <OperatorSidebar/>

      {/* Right Side: Main Dashboard Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full p-1 border border-gray-200"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-600">e</span>Bus Lanka
             </span>
           </div>
           <div className="flex items-center gap-6">
             <span className="font-bold text-gray-600 text-lg">Operator Portal</span>
             <button 
               onClick={() => {
                   localStorage.removeItem("token");
                   localStorage.removeItem("userRole");
                   window.location.href = "/";
               }}
               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition"
             >
               Logout
             </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
          
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Monitor your fleet statistics, sales, and recent bookings.</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {overviewStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-2 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-gray-500 font-bold uppercase tracking-wider text-xs">{stat.title}</div>
                <div className={`text-3xl font-extrabold ${stat.valueColor}`}>
                  {isLoading ? "..." : stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Bookings Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Latest passenger seat reservations across your buses.</p>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white font-semibold text-sm">
                  <tr>
                    <th className="p-4">Bus Number</th>
                    <th className="p-4">Date - Time - Telephone</th>
                    <th className="p-4">Passenger Name</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">Loading recent bookings...</td>
                    </tr>
                  ) : recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No recent bookings found.</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-900">{booking.busNumber}</td>
                        <td className="p-4 text-gray-700 text-xs md:text-sm">
                          <div className="font-semibold">{booking.dateTime}</div>
                          <div className="text-gray-500">{booking.phone}</div>
                        </td>
                        <td className="p-4 font-bold text-gray-900">{booking.passengerName}</td>
                        <td className="p-4 text-gray-700 font-medium">{booking.seats}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}