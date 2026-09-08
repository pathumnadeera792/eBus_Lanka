import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaClipboardList, FaTrash } from "react-icons/fa"; 

// Import Admin Sidebar
import AdminSidebar from "../../components/AdminSidebar"; 

export default function AdminManifest() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [manifests, setManifests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page Protection & Fetching All Manifests
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token || (role !== "admin" && role !== "superadmin")) {
      toast.error("Access Denied. Please login as Super Admin.");
      navigate("/admin/login");
      return;
    }

    fetchAllManifests();
  }, [backendUrl, navigate]);

  const fetchAllManifests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/bookings/admin/manifest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setManifests(response.data);
      }
    } catch (error) {
      console.error("Error fetching all manifests:", error);
      toast.error("Failed to load platform-wide manifest");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Booking by Admin
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking as Admin?")) return;

    const toastId = toast.loading("Deleting booking...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/bookings/operator/delete/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Booking deleted successfully!", { id: toastId });
      setManifests(manifests.filter(item => item._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking", { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800 sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 bg-white rounded-full p-1"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-500">e</span>Bus Lanka
             </span>
           </div>
           <span className="font-bold text-lg">Super Admin</span>
        </div>

        {/* Page Content */}
        <div className="p-10 flex-grow relative">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaClipboardList className="text-3xl text-green-500" />
              <h1 className="text-2xl font-bold">Platform-Wide Passenger Manifest</h1>
            </div>
            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-semibold border border-green-500/20">
              Total Bookings: {manifests.length}
            </span>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700">Bus / Route</th>
                  <th className="p-4 border border-green-700">Operator Details</th>
                  <th className="p-4 border border-green-700">Date - Time - Phone</th>
                  <th className="p-4 border border-green-700">Passenger Name</th>
                  <th className="p-4 border border-green-700">Seats</th>
                  <th className="p-4 border border-green-700">Status</th>
                  <th className="p-4 border border-green-700 w-36">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">Loading platform manifest...</td>
                  </tr>
                ) : manifests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500 bg-gray-50">No bookings found on the platform yet.</td>
                  </tr>
                ) : (
                  manifests.map((item) => {
                    const busNumber = item.busId?.brNumber || item.busId?.busName || "N/A";
                    const routeInfo = item.busId ? `${item.busId.route || 'Route N/A'}` : "N/A";
                    
                    // Operator Details
                    const operatorName = item.busId?.operatorId?.fullName || "N/A";
                    const companyName = item.busId?.operatorId?.companyName || "N/A";
                    
                    const passengerName = item.passengerId?.fullName || "Unknown Passenger";
                    const passengerPhone = item.passengerId?.phone || "No Phone";
                    const journeyDate = item.journeyDate || "N/A";
                    const departureTime = item.busId?.departureTime || "08:00 AM";
                    const seatsList = item.selectedSeats ? item.selectedSeats.join(", ") : "N/A";
                    
                    return (
                      <tr key={item._id} className="hover:bg-gray-50 border-b border-gray-300 transition">
                        
                        {/* Bus Number & Route */}
                        <td className="p-4 border-r border-gray-300 text-left">
                          <div className="font-bold">{busNumber}</div>
                          <div className="text-xs text-gray-500 font-normal">{routeInfo}</div>
                        </td>

                        {/* Operator Details */}
                        <td className="p-4 border-r border-gray-300 text-left text-sm">
                          <div className="font-bold text-green-700">{operatorName}</div>
                          <div className="text-xs text-gray-500">Company: {companyName}</div>
                        </td>

                        {/* Date - Time - Telephone */}
                        <td className="p-4 border-r border-gray-300 text-left text-xs md:text-sm">
                          <div className="font-semibold">{journeyDate}</div>
                          <div className="text-gray-500">{departureTime}</div>
                          <div className="text-gray-500">{passengerPhone}</div>
                        </td>

                        {/* Passenger Name */}
                        <td className="p-4 border-r border-gray-300 text-left font-bold">
                          {passengerName}
                        </td>

                        {/* Seats */}
                        <td className="p-4 border-r border-gray-300 font-medium">
                          {seatsList}
                        </td>

                        {/* Status */}
                        <td className="p-4 border-r border-gray-300">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Paid
                          </span>
                        </td>

                        {/* Action (Delete) */}
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-red-500 hover:text-red-700 transition"
                              title="Delete Booking"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}