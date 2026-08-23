import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";

// Import Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function OperatorLoginPage() {
  // State to hold user input
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      // Secure Backend URL from .env file
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      // Axios request to backend operator login API
      const response = await axios.post(`${backendUrl}/operators/login`, {
        userName: userName,
        password: password,
      });

      // Special check: Is approved by Super Admin?
      if (!response.data.isApproved) {
        toast.error("Your account is not approved yet. Please contact Super Admin.");
        setIsLoading(false);
        return; // Don't proceed to dashboard
      }

      toast.success("Login Successful!");
      
      // Store token and user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("userName", response.data.user.fullName); // (Optional) for display
      
      // Navigate to operator dashboard
      navigate("/operator/dashboard"); 
      
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
    // Reusing standard flex layout with sticky header/footer
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Navbar />

      {/* Main Login Area with Background Image (matching style in image_12.png) */}
      <div 
        className="flex-grow flex items-center justify-center bg-cover bg-center py-20 px-4"
        style={{ backgroundImage: "url('/bg-image.jpg')" }} // Change this if your image name is different
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Dark overlay */}

        {/* Glassmorphism Login Box (centered, matching image_12.png) */}
        <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 p-10 md:p-14 rounded-[30px] shadow-2xl w-full max-w-lg">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-10 drop-shadow-lg border-l-4 border-green-500 pl-4 inline-block mx-auto">
            Bus Operator Login
          </h2>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            
            {/* User Name Field (matching icons in image_12.png) */}
            <div>
              <label className="text-white font-semibold mb-2 block drop-shadow-md">
                User Name
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  // Glass effect input styles
                  className="w-full bg-transparent border border-white/70 rounded-lg px-5 py-3 text-white placeholder-white/70 outline-none focus:border-green-400 focus:bg-white/10 transition"
                />
                <FaUser className="absolute right-5 text-white/70" />
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
                  className="w-full bg-transparent border border-white/70 rounded-lg px-5 py-3 text-white placeholder-white/70 outline-none focus:border-green-400 focus:bg-white/10 transition"
                />
                <FaLock className="absolute right-5 text-white/70" />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 mt-6 text-white rounded-full font-bold text-lg shadow-lg transition duration-300 ${isLoading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Registration Link (matching text in image_12.png) */}
          <p className="mt-8 text-sm text-center text-white drop-shadow-md">
            Do you have no Account ?{" "}
            <Link to="/operator/register" className="text-blue-300 font-bold hover:underline">
              Click here
            </Link>
          </p>
          
        </div>
      </div>

      <Footer />
    </div>
  );
}