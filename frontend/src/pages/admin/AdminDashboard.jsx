import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "superadmin") {
      toast.error("Access Denied. Super Admin only.");
      navigate("/operator/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-black font-sans">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 bg-white rounded-full p-1"/>
             <span className="text-white font-bold"><span className="text-green-500">e</span>Bus Lanka</span>
           </div>
           <span className="text-white font-bold text-lg">Super Admin</span>
        </div>

        {/* Dashboard Content */}
        <div className="p-10 text-white">
          <div className="flex items-center gap-4 mb-10">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <div className="h-1 w-32 bg-green-700"></div>
          </div>

          {/* Stats Cards (matching 1.png) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            
            {/* Card 1 */}
            <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-zinc-700">
              <h3 className="text-xl font-bold mb-4">Active Operators</h3>
              <p className="text-6xl font-bold text-green-600">25</p>
            </div>

             {/* Card 2 */}
             <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-zinc-700">
              <h3 className="text-xl font-bold mb-4">Passangers</h3>
              <p className="text-6xl font-bold text-green-600">90</p>
            </div>

             {/* Card 3 */}
             <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-zinc-700">
              <h3 className="text-xl font-bold mb-4">Total Buses</h3>
              <p className="text-6xl font-bold text-green-600">34</p>
            </div>

             {/* Card 4 */}
             <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-zinc-700">
              <h3 className="text-xl font-bold mb-4">Total Routes</h3>
              <p className="text-6xl font-bold text-green-600">13</p>
            </div>

            {/* Total Revenue Card (Spans full width) */}
            <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-zinc-700 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Total Revenue</h3>
              <p className="text-6xl font-bold text-green-600">LKR 250,000</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}