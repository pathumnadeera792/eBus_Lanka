import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";

// Import Navbar and Footer components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  // State to hold user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("http://localhost:5000/passengers/login", {
        email: email,
        password: password,
      });

      toast.success("Login Successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      navigate("/"); // Navigate to home
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network Error. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Display the Navbar at the top */}
      <Navbar />

      {/* Main Login Area with Background Image */}
      <div 
        className="flex-grow flex items-center justify-center bg-cover bg-center py-20"
        style={{ backgroundImage: "url('/bg-image.jpg')" }} // Change this name if your image name is different
      >
        
        {/* Glassmorphism Login Box */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 p-10 rounded-[30px] shadow-2xl w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">
            User Login
          </h2>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Email Field */}
            <div>
              <label className="text-white font-semibold mb-2 block drop-shadow-md">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  // Glass effect input styles
                  className="w-full bg-transparent border border-white/70 rounded-lg px-4 py-2 text-white placeholder-white/70 outline-none focus:border-green-400"
                />
                <FaEnvelope className="absolute right-4 text-white/70" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-white font-semibold mb-2 block drop-shadow-md">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border border-white/70 rounded-lg px-4 py-2 text-white placeholder-white/70 outline-none focus:border-green-400"
                />
                <FaLock className="absolute right-4 text-white/70" />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full py-3 mt-4 text-white bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg shadow-lg transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Registration Link */}
          <p className="mt-6 text-sm text-center text-white drop-shadow-md">
            Do you have no Account ?{" "}
            <Link to="/register" className="text-blue-300 font-bold hover:underline">
              Click here
            </Link>
          </p>
          
        </div>
      </div>

      {/* Display the Footer at the bottom */}
      <Footer />
    </div>
  );
}