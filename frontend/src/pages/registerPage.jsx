import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Import Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State to hold all form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    address: "",
    securityQuestion: "",
    answer: "",
    phone: "",
    gender: "Male",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // Securely get the backend URL from .env
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      // Sending data to backend (excluding confirmPassword, securityQuestion, and answer as they are not in the backend schema currently)
      const response = await axios.post(`${backendUrl}/api/passengers/register`, {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
        phone: formData.phone,
        gender: formData.gender,
        password: formData.password,
        securityQuestion: formData.securityQuestion, 
        answer: formData.answer
      });

      toast.success(response.data.message || "Registration Successful!");
      
      // Navigate to login page after successful registration
      navigate("/login");
      
} catch (error) {
      console.error("REGISTRATION ERROR:", error); 
      
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); 
      } else {
        toast.error("Registration failed. Please check the console for details.");
      }
      } finally {
      setIsLoading(false);
    }};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Create Passenger <br /> Account
          </h1>
        </div>
      </div>

      {/* Registration Form Area */}
      <div className="flex-grow flex items-center justify-center py-16 px-4">
        
        {/* bg-green-300 Theme applied to the Form Card */}
        <div className="bg-green-100 w-full max-w-5xl p-10 md:p-14 rounded-3xl shadow-xl border border-green-400">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Sign Up</h2>
          
          <form onSubmit={handleRegister}>
            {/* Split layout into two columns for desktop */}
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Address" rows="4" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all resize-none text-gray-800"></textarea>
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Phone No</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone No" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-6 flex flex-col">
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">User Name</label>
                  <input type="text" name="userName" value={formData.userName} onChange={handleChange} required placeholder="User Name" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Security Question</label>
                  <select name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800">
                    <option value="">Select a question...</option>
                    <option value="pet">What's your pet name?</option>
                    <option value="school">What was your first school?</option>
                    <option value="city">In what city were you born?</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Answer</label>
                  <input type="text" name="answer" value={formData.answer} onChange={handleChange} placeholder="Answer" className="w-full p-3 bg-white shadow-sm border border-transparent rounded-lg outline-none focus:border-green-600 focus:shadow-md transition-all text-gray-800" />
                </div>

                {/* Spacer to push button to bottom to align with Left Column */}
                <div className="flex-grow"></div>

                {/* Submit Button & Link */}
                <div className="pt-4 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`px-10 py-3 rounded-full font-bold text-white shadow-md transition-all duration-300 ${isLoading ? "bg-gray-500" : "bg-green-700 hover:bg-green-800 hover:shadow-lg hover:-translate-y-0.5"}`}
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </button>
                  
                  <p className="text-gray-900 font-medium text-sm">
                    Do you have Account ?{" "}
                    <Link to="/login" className="text-blue-700 font-bold hover:underline">
                      Click here
                    </Link>
                  </p>
                </div>
              </div>

            </div>
          </form>
          
        </div>
      </div>

      <Footer />
    </div>
  );
}