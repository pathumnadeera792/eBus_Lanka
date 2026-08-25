import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUsers, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminPassengers() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || (role !== "admin" && role !== "superadmin")) {
      toast.error("Access Denied. Admin only.");
      navigate("/");
      return;
    }

    fetchPassengers();
  }, [backendUrl, navigate]);

  const fetchPassengers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/passengers/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setPassengers(response.data);
      }
    } catch (error) {
      console.error("Error fetching passengers:", error);
      toast.error("Failed to load passengers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    const actionText = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${actionText} this passenger?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendUrl}/api/passengers/admin/toggle-block/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Passenger ${actionText}ed successfully!`);
      fetchPassengers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete passenger: ${name}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/passengers/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Passenger deleted successfully!");
      setPassengers(passengers.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete passenger");
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
              <FaUsers className="text-3xl text-green-500" />
              <h1 className="text-2xl font-bold">Manage Passengers</h1>
            </div>
            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-semibold border border-green-500/20">
              Total Passengers: {passengers.length}
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700">Passenger Name</th>
                  <th className="p-4 border border-green-700">Contact Info</th>
                  <th className="p-4 border border-green-700">Address</th>
                  <th className="p-4 border border-green-700 w-32">Status</th>
                  <th className="p-4 border border-green-700 w-36">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading passengers...</td></tr>
                ) : passengers.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50">No passengers found.</td></tr>
                ) : (
                  passengers.map((pas) => (
                    <tr key={pas._id} className="hover:bg-gray-50 border-b border-gray-300 transition">
                      <td className="p-4 border-r border-gray-300 text-left">
                        <div className="font-bold">{pas.fullName}</div>
                        <div className="text-sm text-gray-500 font-normal">@{pas.userName}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300 text-left text-sm">
                        <div>{pas.email}</div>
                        <div className="text-gray-500">{pas.phone || "N/A"}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300 text-left text-sm text-gray-600">
                        {pas.address || "N/A"}
                      </td>
                      <td className="p-4 border-r border-gray-300">
                        {pas.isBlocked ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleToggleBlock(pas._id, pas.isBlocked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${pas.isBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                            title={pas.isBlocked ? "Active Passenger" : "Block Passenger"}
                          >
                            {pas.isBlocked ? <><FaCheckCircle /> Unblock</> : <><FaBan /> Block</>}
                          </button>
                          <button 
                            onClick={() => handleDelete(pas._id, pas.fullName)}
                            className="p-2 text-red-500 hover:text-red-700 transition"
                            title="Delete Passenger"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
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
  );
}