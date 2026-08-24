import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaBus, FaUpload, FaPlusCircle, FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";

// Import supabase client
import { supabase } from "../../supabase"; 

// Import Components
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";

export default function MyBuses() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    busName: "", brNumber: "", routeNo: "", departureDates: "",
    departureTime: "", departureLocation: "", arrivalTime: "",
    capacity: "", type: "Non-AC", amount: "",
  });

  // Table States
  const [myBuses, setMyBuses] = useState([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);

  // 1. Fetch Operator's Buses on Page Load
  const fetchMyBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/operator/login");
        return;
      }
      
      const response = await axios.get(`${backendUrl}/operators/buses/my-buses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMyBuses(response.data);
    } catch (error) {
      toast.error("Failed to load your buses.");
      console.error(error);
    } finally {
      setIsLoadingBuses(false);
    }
  };

  useEffect(() => {
    fetchMyBuses();
  }, [navigate, backendUrl]);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 2. Submit New Bus
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select a bus image!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading image and saving bus details...");

    try {
      // Upload Image to Supabase
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `buses/${fileName}`; 

      const { error: uploadError } = await supabase.storage
        .from('bus-images') 
        .upload(filePath, imageFile);

      if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

      // Get Public URL
      const { data: publicUrlData } = supabase.storage.from('bus-images').getPublicUrl(filePath);
      const imageUrl = publicUrlData.publicUrl;

      // Send to MongoDB
      const token = localStorage.getItem("token");
      const busDataToSave = {
        ...formData,
        capacity: Number(formData.capacity),
        amount: Number(formData.amount),
        busImage: imageUrl, 
      };

      await axios.post(`${backendUrl}/operators/buses/add`, busDataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Bus added successfully! Waiting for Admin Approval.", { id: toastId });
      
      // Reset Form
      setFormData({
        busName: "", brNumber: "", routeNo: "", departureDates: "",
        departureTime: "", departureLocation: "", arrivalTime: "",
        capacity: "", type: "Non-AC", amount: ""
      });
      setImageFile(null);

      // Refresh the bus list to show the newly added bus
      fetchMyBuses();

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to add bus";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Delete a Bus
  const handleDelete = async (busId, busName) => {
    if (!window.confirm(`Are you sure you want to delete ${busName}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/operators/buses/delete/${busId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`${busName} deleted successfully!`);
      // Update state instantly without refreshing the page
      setMyBuses(myBuses.filter(bus => bus._id !== busId));
    } catch (error) {
      toast.error("Failed to delete bus");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow flex flex-col items-center p-6 py-12 gap-12">
        
        {/* --- ADD NEW BUS FORM SECTION --- */}
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 w-full max-w-4xl border border-gray-100">
          <div className="flex items-center gap-4 mb-8 border-b pb-4">
            <FaBus className="text-4xl text-green-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Add New Bus</h1>
              <p className="text-gray-500 text-sm">Register a new bus to your fleet.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bus Name</label>
                <input type="text" name="busName" required value={formData.busName} onChange={handleChange} placeholder="e.g. Super Line Express" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">BR Number (Reg. No)</label>
                <input type="text" name="brNumber" required value={formData.brNumber} onChange={handleChange} placeholder="e.g. ND-1234" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Route Number</label>
                <input type="text" name="routeNo" required value={formData.routeNo} onChange={handleChange} placeholder="e.g. 138" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bus Type</label>
                <select name="type" required value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition bg-white">
                  <option value="Non-AC">Non-AC</option>
                  <option value="AC">AC</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Departure Location</label>
                <input type="text" name="departureLocation" required value={formData.departureLocation} onChange={handleChange} placeholder="e.g. Colombo" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Departure Dates</label>
                <input type="text" name="departureDates" required value={formData.departureDates} onChange={handleChange} placeholder="e.g. Daily" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Departure Time</label>
                <input type="time" name="departureTime" required value={formData.departureTime} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Arrival Time</label>
                <input type="time" name="arrivalTime" required value={formData.arrivalTime} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Passenger Capacity</label>
                <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange} placeholder="e.g. 54" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price (LKR)</label>
                <input type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange} placeholder="e.g. 1500" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>
            </div>

            <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
              <input type="file" accept="image/*" id="busImage" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <FaUpload className="text-4xl text-green-500 mb-3" />
                <span className="font-bold text-gray-700">
                  {imageFile ? imageFile.name : "Click to upload bus image"}
                </span>
                <span className="text-sm text-gray-500 mt-1">JPEG, PNG, JPG accepted</span>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition duration-300 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                <FaPlusCircle />
                {isSubmitting ? "Processing..." : "Add Bus to System"}
              </button>
            </div>
          </form>
        </div>

        {/* --- MY REGISTERED BUSES TABLE SECTION --- */}
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 w-full max-w-5xl border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">My Registered Buses</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and view the status of your buses.</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 text-white font-semibold text-sm">
                <tr>
                  <th className="p-4">Bus Image</th>
                  <th className="p-4">Bus Details</th>
                  <th className="p-4">Route Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {isLoadingBuses ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">Loading your buses...</td>
                  </tr>
                ) : myBuses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">You haven't registered any buses yet.</td>
                  </tr>
                ) : (
                  myBuses.map((bus) => (
                    <tr key={bus._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        {bus.busImage ? (
                          <img src={bus.busImage} alt={bus.busName} className="w-20 h-14 object-cover rounded-md shadow-sm border border-gray-300" />
                        ) : (
                          <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{bus.busName}</div>
                        <div className="text-gray-500 text-xs mt-1">Reg: {bus.brNumber} | Type: {bus.type}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-700">Route: {bus.routeNo}</div>
                        <div className="text-gray-500 text-xs mt-1">{bus.departureLocation} - {bus.departureTime}</div>
                      </td>
                      <td className="p-4">
                        {bus.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            <FaCheckCircle /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <FaClock /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(bus._id, bus.busName)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                          title="Delete Bus"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}