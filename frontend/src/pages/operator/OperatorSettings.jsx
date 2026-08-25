import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserEdit, FaSave, FaTimes } from "react-icons/fa";

// Import Operator Sidebar
import OperatorSidebar from "../../components/OperatorSidebar"; 

export default function OperatorSettings() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  
  // Original state to reset when Cancel is clicked
  const [initialProfile, setInitialProfile] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "operator") {
      toast.error("Access Denied. Please login as an operator.");
      navigate("/operator/login");
      return;
    }

    fetchOperatorProfile();
  }, [backendUrl, navigate]);

  const fetchOperatorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/operators/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setProfile(response.data);
        setInitialProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load operator profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    toast("Changes discarded", { icon: "ℹ️" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendUrl}/operators/profile`, {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile updated successfully!", { id: toastId });
      setInitialProfile(profile);
      localStorage.setItem("userName", profile.fullName);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", { id: toastId });
    } finally {
      setIsUpdating(false);
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
        <div className="p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h1 className="text-2xl font-extrabold text-gray-800">Operator Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and update your operator profile details.</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500 font-medium">Loading profile details...</div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      required 
                      value={profile.fullName || ""} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={profile.email || ""} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      required 
                      value={profile.phone || ""} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      required 
                      value={profile.address || ""} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition text-gray-900"
                    />
                  </div>
                </div>

                {/* Buttons (Save Changes & Cancel) */}
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="w-1/3 py-3 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className={`w-2/3 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition duration-300 ${isUpdating ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    <FaSave /> {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}