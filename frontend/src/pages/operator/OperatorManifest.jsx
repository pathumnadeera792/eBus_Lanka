import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa"; // Delete අයිකන් එක සඳහා
// Import Operator Sidebar
import OperatorSidebar from "../../components/OperatorSidebar"; 

export default function OperatorManifest() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [manifests, setManifests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Manifests on Load
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token || role !== "operator") {
      toast.error("Access Denied. Please login as an operator.");
      navigate("/operator/login");
      return;
    }

    fetchManifest();
  }, [backendUrl, navigate]);

  const fetchManifest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/bookings/operator/manifest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setManifests(response.data);
      }
    } catch (error) {
      console.error("Error fetching manifest:", error);
      toast.error("Failed to load passenger manifest");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Booking
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    const toastId = toast.loading("Deleting booking...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/bookings/operator/delete/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Booking deleted successfully!", { id: toastId });
      // State එකෙන් අදාළ row එක ඉවත් කිරීම
      setManifests(manifests.filter(item => item._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking", { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-green-100 font-sans text-gray-900">
      
      {/* Sidebar */}
      <OperatorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full p-1 border border-gray-200"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-600">e</span>Bus Lanka
             </span>
           </div>
           <span className="font-bold text-gray-600 text-lg">Operator Portal</span>
        </div>

        {/* Page Content */}
        <div className="p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
          
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Passenger Manifest</h1>
              <p className="text-gray-500 text-sm mt-1">View and track all passenger bookings for your registered fleet.</p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white font-semibold text-sm">
                  <tr>
                    <th className="p-4">Bus Number</th>
                    <th className="p-4">Date - Time - Telephone</th>
                    <th className="p-4">Passenger Name</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Action</th> {/* අලුතින් එකතු කළ Action තීරුව */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Loading manifest...</td>
                    </tr>
                  ) : manifests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No bookings found for your buses yet.</td>
                    </tr>
                  ) : (
                    manifests.map((item) => {
                      const busNumber = item.busId?.brNumber || item.busId?.busName || "N/A";
                      const passengerName = item.passengerId?.fullName || "Unknown Passenger";
                      const passengerPhone = item.passengerId?.phone || "No Phone";
                      const journeyDate = item.journeyDate || "N/A";
                      const departureTime = item.busId?.departureTime || "08:00 AM";
                      const seatsList = item.selectedSeats ? item.selectedSeats.join(", ") : "N/A";
                      
                      return (
                        <tr key={item._id} className="hover:bg-gray-50 transition">
                          
                          {/* Bus Number / BR Number */}
                          <td className="p-4 font-bold text-gray-900">
                            {busNumber}
                          </td>

                          {/* Date - Time - Telephone */}
                          <td className="p-4 text-gray-700 text-xs md:text-sm">
                            <div className="font-semibold">{journeyDate}</div>
                            <div className="text-gray-500">{departureTime}</div>
                            <div className="text-gray-500">{passengerPhone}</div>
                          </td>

                          {/* Passenger Name */}
                          <td className="p-4 font-bold text-gray-900">
                            {passengerName}
                          </td>

                          {/* Seats */}
                          <td className="p-4 text-gray-700 font-medium">
                            {seatsList}
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                              Paid
                            </span>
                          </td>

                          {/* Action (Delete Button) */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                              title="Delete Booking"
                            >
                              <FaTrash className="text-base" />
                            </button>
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
    </div>
  );
}