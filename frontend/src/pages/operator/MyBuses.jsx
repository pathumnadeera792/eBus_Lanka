import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaBus, FaUpload, FaPlusCircle, FaTrash, FaCheckCircle, FaClock, FaEdit, FaTimes, FaCalendarPlus } from "react-icons/fa";

// Import supabase client
import { supabase } from "../../supabase"; 

// Import Operator Sidebar
import OperatorSidebar from "../../components/OperatorSidebar"; 

export default function MyBuses() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Form States (For Adding New Bus)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  // departureDates now holds an array of strings
  const [formData, setFormData] = useState({
    busName: "", brNumber: "", routeNo: "", destination: "", departureDates: [],
    departureTime: "", departureLocation: "", arrivalTime: "",
    capacity: "", type: "Non-AC", amount: "",
  });

  // Temporary state for adding a custom date or selecting days
  const [dateInput, setDateInput] = useState("");

  // Table States
  const [myBuses, setMyBuses] = useState([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);

  // Add Bus Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBusId, setEditBusId] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editDateInput, setEditDateInput] = useState("");
  const [editFormData, setEditFormData] = useState({
    busName: "", brNumber: "", routeNo: "", destination: "", departureDates: [],
    departureTime: "", departureLocation: "", arrivalTime: "",
    capacity: "", type: "Non-AC", amount: "", busImage: ""
  });

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

  // Handle Add Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Quick Add Date/Day to Array (Add Form)
  const handleAddDate = (val) => {
    if (!val) return;
    if (formData.departureDates.includes(val)) {
      toast.error("This date/day is already added!");
      return;
    }
    setFormData({ ...formData, departureDates: [...formData.departureDates, val] });
    setDateInput("");
  };

  // Remove Date from Array (Add Form)
  const handleRemoveDate = (indexToRemove) => {
    setFormData({
      ...formData,
      departureDates: formData.departureDates.filter((_, index) => index !== indexToRemove)
    });
  };

  // Handle Add Image Selection
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
    if (formData.departureDates.length === 0) {
      toast.error("Please add at least one departure date or schedule (e.g. Daily)!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading image and saving bus details...");

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`; 

      const { error: uploadError } = await supabase.storage
        .from('bus-images') 
        .upload(filePath, imageFile);

      if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage.from('bus-images').getPublicUrl(filePath);
      const imageUrl = publicUrlData.publicUrl;

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
      
      setFormData({
        busName: "", brNumber: "", routeNo: "", destination: "", departureDates: [],
        departureTime: "", departureLocation: "", arrivalTime: "",
        capacity: "", type: "Non-AC", amount: ""
      });
      setImageFile(null);
      setIsAddModalOpen(false);

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
      setMyBuses(myBuses.filter(bus => bus._id !== busId));
    } catch (error) {
      toast.error("Failed to delete bus");
      console.error(error);
    }
  };

  // --- EDIT BUS FUNCTIONS ---
  const openEditModal = (bus) => {
    setEditBusId(bus._id);
    setEditFormData({
      busName: bus.busName,
      brNumber: bus.brNumber,
      routeNo: bus.routeNo,
      destination: bus.destination || "",
      departureDates: Array.isArray(bus.departureDates) ? bus.departureDates : [bus.departureDates],
      departureTime: bus.departureTime,
      departureLocation: bus.departureLocation,
      arrivalTime: bus.arrivalTime,
      capacity: bus.capacity,
      type: bus.type,
      amount: bus.amount,
      busImage: bus.busImage
    });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditAddDate = (val) => {
    if (!val) return;
    if (editFormData.departureDates.includes(val)) {
      toast.error("Already added!");
      return;
    }
    setEditFormData({ ...editFormData, departureDates: [...editFormData.departureDates, val] });
    setEditDateInput("");
  };

  const handleEditRemoveDate = (indexToRemove) => {
    setEditFormData({
      ...editFormData,
      departureDates: editFormData.departureDates.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const toastId = toast.loading("Updating bus details...");

    try {
      let finalImageUrl = editFormData.busImage;

      if (editImageFile) {
        const fileExt = editImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bus-images')
          .upload(fileName, editImageFile);

        if (uploadError) throw new Error("New image upload failed");

        const { data: publicUrlData } = supabase.storage.from('bus-images').getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const token = localStorage.getItem("token");
      const updatedBusData = {
        ...editFormData,
        capacity: Number(editFormData.capacity),
        amount: Number(editFormData.amount),
        busImage: finalImageUrl,
      };

      await axios.put(`${backendUrl}/operators/buses/update/${editBusId}`, updatedBusData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Bus updated successfully!", { id: toastId });
      setIsEditModalOpen(false);
      fetchMyBuses();

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update bus";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-green-100 font-sans text-gray-900">
      
      <OperatorSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full p-1 border border-gray-200"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-600">e</span>Bus Lanka
             </span>
           </div>
           <span className="font-bold text-gray-600 text-lg">Operator Portal</span>
        </div>

        <div className="p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
          
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">My Registered Buses</h1>
              <p className="text-gray-500 text-sm mt-1">Manage, add, and view the status of your fleet.</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <FaPlusCircle className="text-lg" /> Add New Bus
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
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
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">Loading your buses...</td></tr>
                  ) : myBuses.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">You haven't registered any buses yet. Click "Add New Bus" to get started.</td></tr>
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
                          <div className="font-semibold text-gray-700">{bus.departureLocation} $\rightarrow$ {bus.destination}</div>
                          <div className="text-gray-500 text-xs mt-1">Route: {bus.routeNo} | {bus.departureTime}</div>
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
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => openEditModal(bus)}
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition"
                              title="Edit Bus"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button 
                              onClick={() => handleDelete(bus._id, bus.busName)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                              title="Delete Bus"
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

        {/* --- ADD BUS MODAL --- */}
        {isAddModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 relative max-h-[95vh] overflow-y-auto">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition text-2xl"
              >
                <FaTimes />
              </button>
              
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <FaBus className="text-3xl text-green-600" />
                <h2 className="text-2xl font-extrabold text-gray-800">Add New Bus</h2>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Location (From)</label>
                    <input type="text" name="departureLocation" required value={formData.departureLocation} onChange={handleChange} placeholder="e.g. Colombo" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination (To)</label>
                    <input type="text" name="destination" required value={formData.destination} onChange={handleChange} placeholder="e.g. Kandy" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" />
                  </div>

                  {/* Multiple Dates / Schedule Input Section */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Schedule (Days / Dates)</label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button type="button" onClick={() => handleAddDate("Daily")} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-200">+ Daily</button>
                      <button type="button" onClick={() => handleAddDate("Monday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Monday</button>
                      <button type="button" onClick={() => handleAddDate("Tuesday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Tuesday</button>
                      <button type="button" onClick={() => handleAddDate("Wednesday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Wednesday</button>
                      <button type="button" onClick={() => handleAddDate("Thursday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Thursday</button>
                      <button type="button" onClick={() => handleAddDate("Friday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Friday</button>
                      <button type="button" onClick={() => handleAddDate("Saturday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Saturday</button>
                      <button type="button" onClick={() => handleAddDate("Sunday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Sunday</button>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={dateInput} 
                        onChange={(e) => setDateInput(e.target.value)} 
                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleAddDate(dateInput)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-gray-900"
                      >
                        <FaCalendarPlus /> Add Date
                      </button>
                    </div>

                    {/* Display added dates/schedules pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.departureDates.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {item}
                          <button type="button" onClick={() => handleRemoveDate(index)} className="hover:text-red-200 ml-1">×</button>
                        </span>
                      ))}
                      {formData.departureDates.length === 0 && (
                        <span className="text-xs text-red-500">No schedule added yet. Please add at least one schedule.</span>
                      )}
                    </div>
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

                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                  <input type="file" accept="image/*" id="busImage" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <FaUpload className="text-3xl text-green-500 mb-2" />
                    <span className="font-bold text-gray-700 text-sm">
                      {imageFile ? imageFile.name : "Click to upload bus image"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG accepted</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-2/3 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition duration-300 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    <FaPlusCircle />
                    {isSubmitting ? "Processing..." : "Add Bus to System"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* --- EDIT BUS MODAL --- */}
        {isEditModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 relative max-h-[95vh] overflow-y-auto">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition text-2xl"
              >
                <FaTimes />
              </button>
              
              <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-4">
                Edit Bus Details
              </h2>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bus Name</label>
                    <input type="text" name="busName" required value={editFormData.busName} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">BR Number (Reg. No)</label>
                    <input type="text" name="brNumber" required value={editFormData.brNumber} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Route Number</label>
                    <input type="text" name="routeNo" required value={editFormData.routeNo} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bus Type</label>
                    <select name="type" required value={editFormData.type} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                      <option value="Non-AC">Non-AC</option>
                      <option value="AC">AC</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Location (From)</label>
                    <input type="text" name="departureLocation" required value={editFormData.departureLocation} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination (To)</label>
                    <input type="text" name="destination" required value={editFormData.destination} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>

                  {/* Edit Multiple Dates Section */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Schedule (Days / Dates)</label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button type="button" onClick={() => handleEditAddDate("Daily")} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-200">+ Daily</button>
                      <button type="button" onClick={() => handleEditAddDate("Monday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Monday</button>
                      <button type="button" onClick={() => handleEditAddDate("Tuesday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Tuesday</button>
                      <button type="button" onClick={() => handleEditAddDate("Wednesday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Wednesday</button>
                      <button type="button" onClick={() => handleEditAddDate("Thursday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Thursday</button>
                      <button type="button" onClick={() => handleEditAddDate("Friday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Friday</button>
                      <button type="button" onClick={() => handleEditAddDate("Saturday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Saturday</button>
                      <button type="button" onClick={() => handleEditAddDate("Sunday")} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200">+ Sunday</button>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={editDateInput} 
                        onChange={(e) => setEditDateInput(e.target.value)} 
                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleEditAddDate(editDateInput)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-gray-900"
                      >
                        <FaCalendarPlus /> Add Date
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {editFormData.departureDates.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {item}
                          <button type="button" onClick={() => handleEditRemoveDate(index)} className="hover:text-red-200 ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Time</label>
                    <input type="time" name="departureTime" required value={editFormData.departureTime} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Arrival Time</label>
                    <input type="time" name="arrivalTime" required value={editFormData.arrivalTime} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Passenger Capacity</label>
                    <input type="number" name="capacity" required min="1" value={editFormData.capacity} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price (LKR)</label>
                    <input type="number" name="amount" required min="1" value={editFormData.amount} onChange={handleEditChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Update Bus Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {editFormData.busImage && !editImageFile && (
                      <img src={editFormData.busImage} alt="Current" className="w-24 h-16 object-cover rounded border border-gray-300" />
                    )}
                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className={`w-2/3 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition duration-300 ${isUpdating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}