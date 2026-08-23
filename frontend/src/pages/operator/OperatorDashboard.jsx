import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import Components
import OperatorSidebar from "../../components/OperatorSidebar";

export default function OperatorDashboard() {
  const navigate = useNavigate();
  
  // Simple Page Protection check for Operator role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "operator") {
      toast.error("Please login as Operator");
      navigate("/choose-login");
    }
  }, [navigate]);

  // Dummy Overview Data
  const overviewStats = [
    { title: "Total Buses", value: "2", valueColor: "text-green-900" },
    { title: "Today's Sales", value: "LKR 9,000", valueColor: "text-green-900" },
    { title: "Seats Booked", value: "16", valueColor: "text-green-900" },
  ];

  // Dummy Recent Bookings Data
  const recentBookings = [
    { busNumber: "WPND-1234", dateTime: "2026/07/20 08:00 AM", phone: "077 4299871", passengerName: "Nimal Perera", seats: "12/13", status: "Paid" },
    { busNumber: "WPND-1534", dateTime: "2026/07/20 08:00 AM", phone: "077 4299871", passengerName: "Nimal Silva", seats: "12/23", status: "Pend" },
  ];

  return (
    <div className="flex min-h-screen bg-green-100">
      
      {/* Left Side: Sidebar */}
      <OperatorSidebar/>

      {/* Right Side: Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-10 py-4 bg-green-100/80 backdrop-blur-md border-b border-green-200 shadow-sm">
          <div className="text-xl font-bold text-gray-800">Operator Dashboard</div>
          
          <button 
            onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");
                window.location.href = "/";
            }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-md transition"
          >
            Logout
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-10 space-y-12">
          
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900">Dashboard Overview</h1>
            <div className="h-1 w-32 bg-green-500 rounded-full"></div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {overviewStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-green-300 p-10 rounded-2xl shadow-lg border border-green-400 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-gray-900 font-extrabold uppercase tracking-wider text-sm">{stat.title}</div>
                <div className={`text-5xl font-extrabold ${stat.valueColor} drop-shadow-lg`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-green-300 p-10 rounded-2xl shadow-lg border border-green-400">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings Overview</h2>
                <div className="h-1 w-24 bg-green-500 rounded-full"></div>
            </div>
            
            <table className="w-full text-left text-sm text-gray-900">
              <thead className="bg-green-700 text-white font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-5 py-3">Bus Number</th>
                  <th className="px-5 py-3">Date-Time-Telephone</th>
                  <th className="px-5 py-3">Passenger Name</th>
                  <th className="px-5 py-3">Seats</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold">{booking.busNumber}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      {booking.dateTime} <br/> {booking.phone}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{booking.passengerName}</td>
                    <td className="px-5 py-4 font-medium">{booking.seats}</td>
                    <td className="px-5 py-4 font-bold">
                        {booking.status === "Paid" ? (
                            <span className="text-green-600">Paid</span>
                        ) : (
                            <span className="text-red-600">Pend</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}