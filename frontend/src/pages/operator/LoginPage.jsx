import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa"; 

// Import Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function OperatorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      let response;
      let isSuperAdmin = false;
      
      try {
        // search operator from db
        response = await axios.post(`${backendUrl}/operators/login`, {
          email: email, 
          password: password,
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          response = await axios.post(`${backendUrl}/admins/login`, {
            email: email,
            password: password,
          });
          isSuperAdmin = true; // identify admin
        } else {
          throw error; 
        }
      }

      // Operator approve check
      if (!isSuperAdmin && !response.data.isApproved) {
        toast.error("Your account is not approved yet. Please contact Super Admin.");
        setIsLoading(false);
        return; 
      }

      toast.success("Login Successful!");
      
      // Store token and user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("userName", response.data.user.fullName); 
      
      // Role base pages
      if (response.data.user.role === "superadmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/operator/dashboard");
      }
      
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

      <div 
        className="flex-grow flex items-center justify-center bg-cover bg-center py-20 px-4"
        style={{ backgroundImage: "url('/bg-image.jpg')" }} 
      >
        <div className="absolute inset-0 bg-black/60"></div> 

        <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 p-10 md:p-14 rounded-[30px] shadow-2xl w-full max-w-lg">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-10 drop-shadow-lg border-l-4 border-green-500 pl-4 inline-block mx-auto">
            System Login
          </h2>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            
            {/* Email Field */}
            <div>
              <label className="text-white font-semibold mb-2 block drop-shadow-md">
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border border-white/70 rounded-lg px-5 py-3 text-white placeholder-white/70 outline-none focus:border-green-400 focus:bg-white/10 transition"
                />
                <FaEnvelope className="absolute right-5 text-white/70" />
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

          {/* Registration Link */}
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