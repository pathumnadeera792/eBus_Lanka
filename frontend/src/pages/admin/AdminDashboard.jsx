import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaThLarge, FaUserTie, FaUsers, FaBus, FaRoute, FaMoneyBillWave } from "react-icons/fa";

import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [stats, setStats] = useState({
    totalOperators: 0,
    totalPassengers: 0,
    totalBuses: 0,
    totalRoutes: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    // Super admin role පරීක්ෂා කිරීම (admin හෝ superadmin දෙකම අනුමත කිරීමට)
    if (!token || (role !== "admin" && role !== "superadmin")) {
      toast.error("Access Denied. Super Admin only.");
      navigate("/operator/login");
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/bookings/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats({
          totalOperators: response.data.totalOperators || 0,
          totalPassengers: response.data.totalPassengers || 0,
          totalBuses: response.data.totalBuses || 0,
          totalRoutes: response.data.totalRoutes || 0,
          totalRevenue: response.data.totalRevenue || 0,
        });
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, [navigate, backendUrl]);

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800 sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 bg-white rounded-full p-1"/>
             <span className="text-white font-bold"><span className="text-green-500">e</span>Bus Lanka</span>
           </div>
           <span className="text-white font-bold text-lg">Super Admin</span>
        </div>

        {/* Dashboard Content */}
        <div className="p-10 text-white flex-grow">
          <div className="flex items-center gap-4 mb-10">
            <FaThLarge className="text-3xl text-green-500" />
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <div className="h-1 w-32 bg-green-600"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            
            {/* Card 1: Active Operators */}
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-zinc-800 shadow-xl hover:border-green-500/50 transition">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FaUserTie className="text-xl text-green-500" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Active Operators</h3>
              </div>
              <p className="text-5xl font-extrabold text-green-500 mt-2">
                {isLoading ? "..." : stats.totalOperators}
              </p>
            </div>

             {/* Card 2: Passengers */}
             <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-zinc-800 shadow-xl hover:border-green-500/50 transition">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FaUsers className="text-xl text-green-500" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Passengers</h3>
              </div>
              <p className="text-5xl font-extrabold text-green-500 mt-2">
                {isLoading ? "..." : stats.totalPassengers}
              </p>
            </div>

             {/* Card 3: Total Buses */}
             <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-zinc-800 shadow-xl hover:border-green-500/50 transition">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FaBus className="text-xl text-green-500" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Total Buses</h3>
              </div>
              <p className="text-5xl font-extrabold text-green-500 mt-2">
                {isLoading ? "..." : stats.totalBuses}
              </p>
            </div>

             {/* Card 4: Total Routes */}
             <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-zinc-800 shadow-xl hover:border-green-500/50 transition">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FaRoute className="text-xl text-green-500" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Total Routes</h3>
              </div>
              <p className="text-5xl font-extrabold text-green-500 mt-2">
                {isLoading ? "..." : stats.totalRoutes}
              </p>
            </div>

            {/* Total Revenue Card (Spans full width) */}
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-zinc-800 shadow-xl hover:border-green-500/50 transition md:col-span-2">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FaMoneyBillWave className="text-2xl text-green-500" />
                <h3 className="text-xl font-bold uppercase tracking-wider">Total Revenue</h3>
              </div>
              <p className="text-5xl md:text-6xl font-extrabold text-green-500 mt-2">
                {isLoading ? "..." : `LKR ${stats.totalRevenue.toLocaleString()}`}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}