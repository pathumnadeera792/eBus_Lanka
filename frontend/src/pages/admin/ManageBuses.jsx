import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaEye, FaTimes, FaBus } from "react-icons/fa";

import AdminSidebar from "../../components/AdminSidebar";

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Fetch All Approved Buses
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "superadmin") {
      toast.error("Access Denied.");
      navigate("/operator/login");
      return;
    }

    const fetchBuses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admins/buses/all`);
        if (Array.isArray(response.data)) {
          setBuses(response.data);
        } else {
          setBuses([]);
        }
      } catch (error) {
        toast.error("Failed to load buses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [navigate, backendUrl]);

  // 2. Delete Bus (Super Admin Action)
  const handleDelete = async (busId, busName) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${busName} from the system?`)) return;
    try {
      // මෙතන අර Reject API එකම පාවිච්චි කරන්න පුළුවන්, නැත්නම් වෙනම Delete API එකක් Admin ට හදන්න පුළුවන්. 
      // පහසුව සඳහා අපි කලින් හදපු Reject එකම පාවිච්චි කරමු (එකෙන් වෙන්නෙත් Delete වෙන එකමයි).
      await axios.delete(`${backendUrl}/admins/buses/reject/${busId}`);
      toast.success(`${busName} deleted successfully!`);
      setBuses(prev => prev.filter(bus => bus._id !== busId));
      if (selectedBus && selectedBus._id === busId) setSelectedBus(null);
    } catch (error) {
      toast.error("Failed to delete bus");
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800 sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 bg-white rounded-full p-1"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-500">e</span>Bus Lanka
             </span>
           </div>
           <span className="font-bold text-lg">Super Admin</span>
        </div>

        <div className="p-10 flex-grow relative">
          <div className="flex items-center gap-3 mb-8">
            <FaBus className="text-3xl text-green-500" />
            <h1 className="text-2xl font-bold">Manage All Buses</h1>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700 w-24">Image</th>
                  <th className="p-4 border border-green-700">Bus Name</th>
                  <th className="p-4 border border-green-700">Operator</th>
                  <th className="p-4 border border-green-700">Type & Route</th>
                  <th className="p-4 border border-green-700 w-24">View</th>
                  <th className="p-4 border border-green-700 w-24">Action</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading buses...</td></tr>
                ) : buses.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500 bg-gray-50">No buses found in the system.</td></tr>
                ) : (
                  buses.map((bus) => (
                    <tr key={bus._id} className="hover:bg-gray-50 border-b border-gray-300 transition">
                      <td className="p-3 border-r border-gray-300">
                        {bus.busImage ? (
                           <img src={bus.busImage} alt="bus" className="w-16 h-12 object-cover rounded shadow-sm mx-auto" />
                        ) : (
                           <div className="w-16 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center text-xs text-gray-500">N/A</div>
                        )}
                      </td>
                      <td className="p-4 border-r border-gray-300 text-left">
                        <div className="font-bold">{bus.busName}</div>
                        <div className="text-sm text-gray-500">{bus.brNumber}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300">
                        {bus.operatorId ? bus.operatorId.companyName || bus.operatorId.fullName : "Unknown"}
                      </td>
                      <td className="p-4 border-r border-gray-300">
                        <div>{bus.type}</div>
                        <div className="text-sm text-gray-500">Route: {bus.routeNo}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300">
                        <button 
                           onClick={() => setSelectedBus(bus)}
                           className="text-blue-500 hover:text-blue-700 transition"
                           title="View Details"
                        >
                          <FaEye className="text-2xl mx-auto" />
                        </button>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleDelete(bus._id, bus.busName)} 
                          className="text-red-500 hover:text-red-700 transition" 
                          title="Delete Bus from System"
                        >
                          <FaTrash className="text-xl mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Pop-up Modal Section (Same as BusRequests) --- */}
        {selectedBus && (
          <div 
            onClick={() => setSelectedBus(null)} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white text-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl p-8 relative flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedBus(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition text-2xl"
              >
                <FaTimes />
              </button>

              <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-green-500 inline-block pb-1">
                  Bus Overview
                </h2>
                {selectedBus.busImage ? (
                  <img src={selectedBus.busImage} alt="Bus" className="w-full h-auto object-cover rounded-xl shadow-md border border-gray-200" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 font-medium">No Image Uploaded</span>
                  </div>
                )}
                
                {selectedBus.operatorId && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Operator Details</h3>
                    <p className="text-sm"><span className="font-semibold text-gray-600">Company:</span> {selectedBus.operatorId.companyName}</p>
                    <p className="text-sm"><span className="font-semibold text-gray-600">Owner:</span> {selectedBus.operatorId.fullName}</p>
                    <p className="text-sm"><span className="font-semibold text-gray-600">Phone:</span> {selectedBus.operatorId.phone}</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6 border-b-2 border-green-500 inline-block pb-1">
                    Technical & Route Details
                  </h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Bus Name</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.busName}</div></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">BR Number</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.brNumber}</div></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Bus Type</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.type}</div></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Capacity</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.capacity} Seats</div></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Route No</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.routeNo}</div></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Departure Dates</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.departureDates}</div></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Dep. Location & Time</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedBus.departureLocation} - {selectedBus.departureTime}</div></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 font-bold uppercase block mb-1">Ticket Price</label><div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-bold text-green-700 text-sm">LKR {selectedBus.amount}</div></div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end border-t pt-4 border-gray-200">
                    <button 
                      onClick={() => handleDelete(selectedBus._id, selectedBus.busName)}
                      className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition shadow-md text-sm flex items-center gap-2"
                    >
                      <FaTrash /> Delete Bus
                    </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}