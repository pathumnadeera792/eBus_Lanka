import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaTrash, FaStar } from "react-icons/fa";

// Import Sidebar
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminReviews() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Load & Check Role
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "superadmin") {
      toast.error("Access Denied.");
      navigate("/operator/login");
      return;
    }

    const fetchAdminReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/reviews/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching admin reviews", error);
        toast.error("Failed to load reviews for admin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminReviews();
  }, [navigate, backendUrl]);

  // Toggle approval status
  const handleToggleApproval = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/api/reviews/admin/status/${id}`,
        { isApproved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Review ${!currentStatus ? "Approved" : "Disapproved"} successfully!`);
      
      // Refresh list locally
      setReviews(prev => prev.map(rev => rev._id === id ? { ...rev, isApproved: !currentStatus } : rev));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/reviews/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review deleted successfully!");
      setReviews(prev => prev.filter(rev => rev._id !== id));
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar 
        key={index} 
        className={`inline-block text-xs ${index < count ? "text-yellow-400" : "text-gray-300"}`} 
      />
    ));
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
          <div className="flex items-center gap-3 mb-8">
            <FaStar className="text-3xl text-green-500" />
            <h1 className="text-2xl font-bold">Manage Passenger Reviews</h1>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700 w-16">#</th>
                  <th className="p-4 border border-green-700">Passenger Name</th>
                  <th className="p-4 border border-green-700">Rating</th>
                  <th className="p-4 border border-green-700">Comment</th>
                  <th className="p-4 border border-green-700 w-32">Status</th>
                  <th className="p-4 border border-green-700 w-44">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">Loading reviews...</td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 bg-gray-50">No reviews submitted yet.</td>
                  </tr>
                ) : (
                  reviews.map((rev, index) => {
                    const passengerName = rev.passengerId 
                      ? `${rev.passengerId.firstName || ""} ${rev.passengerId.lastName || ""}`.trim() || rev.passengerId.email 
                      : "Unknown Passenger";

                    return (
                      <tr key={rev._id} className="hover:bg-gray-50 border-b border-gray-300 transition">
                        <td className="p-4 border-r border-gray-300 text-gray-500">{index + 1}</td>
                        <td className="p-4 border-r border-gray-300 text-left font-semibold text-gray-900">
                          {passengerName}
                        </td>
                        <td className="p-4 border-r border-gray-300">
                          <div className="flex justify-center gap-0.5">{renderStars(rev.rating)}</div>
                        </td>
                        <td className="p-4 border-r border-gray-300 text-gray-700 text-left max-w-xs truncate font-normal">
                          "{rev.comment}"
                        </td>
                        <td className="p-4 border-r border-gray-300">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${rev.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {rev.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleToggleApproval(rev._id, rev.isApproved)}
                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold transition flex items-center gap-1 ${rev.isApproved ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}`}
                              title={rev.isApproved ? "Disapprove" : "Approve"}
                            >
                              {rev.isApproved ? <FaTimesCircle /> : <FaCheckCircle />} 
                              {rev.isApproved ? "Unapprove" : "Approve"}
                            </button>
                            <button 
                              onClick={() => handleDeleteReview(rev._id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                              title="Delete Review"
                            >
                              <FaTrash className="text-sm" />
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