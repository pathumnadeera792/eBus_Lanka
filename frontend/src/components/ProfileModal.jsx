import React, { useState, useEffect } from "react";
import { FaUserCircle, FaTimes, FaEdit, FaSave } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfileModal({ isOpen, onClose }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchPassengerProfile();
      setIsEditing(false);
    }
  }, [isOpen]);

  const fetchPassengerProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/passengers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendUrl}/api/passengers/profile`, {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile updated successfully!", { id: toastId });
      setIsEditing(false);
      fetchPassengerProfile();
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error(error.response?.data?.message || "Failed to update profile", { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    /* fixed inset-0 සමඟ h-screen w-screen සහ z-[99999] යෙදීමෙන් Navbar එක උඩින්ම සම්පූර්ණ Screen එක ආවරණය කරගත හැක */
    <div className="fixed inset-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative border border-gray-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl font-bold transition"
        >
          <FaTimes />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-6xl text-green-600 mb-2" />
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isEditing ? "Edit Profile" : "Passenger Profile"}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 font-medium">Loading profile...</div>
        ) : !isEditing ? (
          /* --- VIEW MODE --- */
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">Full Name:</span>
                <span className="font-bold text-gray-900">{profile.fullName || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">Username:</span>
                <span className="font-bold text-gray-900">{profile.userName || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">Email:</span>
                <span className="font-bold text-gray-900">{profile.email || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">Phone:</span>
                <span className="font-bold text-gray-900">{profile.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Address:</span>
                <span className="font-bold text-gray-900">{profile.address || "N/A"}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <FaEdit /> Edit Profile
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* --- EDIT MODE --- */
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={profile.fullName} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email (Cannot be changed)</label>
              <input 
                type="email" 
                name="email" 
                value={profile.email} 
                disabled 
                className="w-full p-3 border border-gray-200 bg-gray-100 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                value={profile.phone} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
              <input 
                type="text" 
                name="address" 
                value={profile.address} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <FaSave /> Save Changes
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}