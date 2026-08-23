import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Import Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function OperatorRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State to hold all form inputs based on your Mongoose Model
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    address: "",
    phone: "",
    gender: "Male",
    companyName: "",
    brNumber: "",
    bankAccountDetails: "",
    userName: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    answer: "",
  });

  // Function to handle input changes for all fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Regular expression for a strong password:
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // 2. Validation: Check if password is strong enough
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setIsLoading(true);

    try {
      // Get the backend URL from .env file securely
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      // Sending data to backend. Note we don't send 'confirmPassword' as it's not in the model.
      const { confirmPassword, ...dataToSend } = formData;
      
      // Axios request to backend operator registration API
      const response = await axios.post(`${backendUrl}/operators/register`, dataToSend);

      toast.success(response.data.message || "Registration successful! Waiting for Admin approval.");
      
      // Navigate to operator login page after successful registration
      navigate("/operator/login");
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network Error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Bus Operator <br /> Account
          </h1>
        </div>
      </div>

      {/* Registration Form Area (Matching style in image_13.png) */}
      <div className="flex-grow flex items-center justify-center py-16 px-4 ">
        
        {/* Form Container (Pop-out style white card) */}
        <div className="bg-green-100 w-full max-w-6xl p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100 ">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 border-b-2 border-green-500 pb-4 inline-block">Sign Up</h2>
          
          <form onSubmit={handleRegister}>
            {/* Split layout into two columns */}
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* --- Left Column --- */}
              <div className="flex-1 space-y-6">
                {/* Fields for normal info */}
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Address" rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition resize-none text-gray-800"></textarea>
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Phone No</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone No" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Fields specifically for operators (matching image_13.png layout) */}
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Bank Account Details</label>
                  <textarea name="bankAccountDetails" value={formData.bankAccountDetails} onChange={handleChange} required placeholder="Bank Account details (Name, Account No, Bank, Branch)" rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition resize-none text-gray-800"></textarea>
                </div>
              </div>

              {/* --- Right Column --- */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Company Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>

                <div>
                  <label className="text-gray-900 font-bold mb-2 block">BR Numbers</label>
                  <input type="text" name="brNumber" value={formData.brNumber} onChange={handleChange} required placeholder="BR Number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>

                <div>
                  <label className="text-gray-900 font-bold mb-2 block">User Name</label>
                  <input type="text" name="userName" value={formData.userName} onChange={handleChange} required placeholder="User Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Strong Password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                  <small className="text-gray-500 text-xs">At least 8 chars, uppercase, lowercase, number, special char.</small>
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" />
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Security Question</label>
                  <select name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" required>
                    <option value="">Select a question...</option>
                    <option value="pet">What's your pet name?</option>
                    <option value="school">What was your first school?</option>
                    <option value="city">In what city were you born?</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-900 font-bold mb-2 block">Answer</label>
                  <input type="text" name="answer" value={formData.answer} onChange={handleChange} placeholder="Answer" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-600 focus:bg-white transition text-gray-800" required />
                </div>

                {/* Submit Button & Link to login */}
                <div className="pt-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`px-12 py-3 rounded-full font-bold text-white shadow-md transition-all duration-300 ${isLoading ? "bg-gray-500" : "bg-green-700 hover:bg-green-800 hover:shadow-lg hover:-translate-y-0.5"}`}
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </button>
                  
                  <p className="text-gray-900 font-medium text-sm">
                    Do you have Account ?{" "}
                    <Link to="/operator/login" className="text-blue-700 font-bold hover:underline">
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