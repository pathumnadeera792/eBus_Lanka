import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaQuestionCircle } from "react-icons/fa";

// Import Navbar and Footer components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  // State to hold user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // States for Forgot Password Modal / View
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Answer Question & New Password
  const [resetEmail, setResetEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      // Using the secure Backend URL from the .env file
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      const response = await axios.post(`${backendUrl}/api/passengers/login`, {
        email: email,
        password: password,
      });

      toast.success("Login Successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      navigate("/find-bus"); // Navigate to bus page
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network Error. Please try again.");
      }
    }
  };

  // Handle Step 1: Get Security Question
  const handleGetQuestion = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/passengers/forgot-password`, {
        email: resetEmail,
      });
      setSecurityQuestion(response.data.securityQuestion);
      setStep(2);
      toast.success("Security question fetched successfully");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network Error. Please try again.");
      }
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/passengers/reset-password`, {
        email: resetEmail,
        answer: answer,
        newPassword: newPassword,
      });

      toast.success(response.data.message);
      setShowForgotPassword(false);
      setStep(1);
      setResetEmail("");
      setSecurityQuestion("");
      setAnswer("");
      setNewPassword("");
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
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        
        {/* Glassmorphism Login Box */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 p-10 rounded-[30px] shadow-2xl w-full max-w-md">
          
          {!showForgotPassword ? (
            <>
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
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-200 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button 
                  type="submit" 
                  className="w-full py-3 mt-2 text-white bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg shadow-lg transition duration-300"
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
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-lg">
                Reset Password
              </h2>

              {step === 1 ? (
                <form onSubmit={handleGetQuestion} className="flex flex-col gap-6">
                  <div>
                    <label className="text-white font-semibold mb-2 block drop-shadow-md">
                      Enter your Registered Email
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        placeholder="Email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border border-white/70 rounded-lg px-4 py-2 text-white placeholder-white/70 outline-none focus:border-green-400"
                      />
                      <FaEnvelope className="absolute right-4 text-white/70" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg shadow-lg transition duration-300"
                  >
                    Next
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-center text-white hover:underline mt-2"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div>
                    <label className="text-white font-semibold mb-1 block text-sm drop-shadow-md">
                      Security Question:
                    </label>
                    <p className="text-yellow-200 font-medium mb-3 bg-white/10 p-2 rounded-lg border border-white/20">
                      {securityQuestion}
                    </p>
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-1 block text-sm drop-shadow-md">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      placeholder="Answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      required
                      className="w-full bg-transparent border border-white/70 rounded-lg px-4 py-2 text-white placeholder-white/70 outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-1 block text-sm drop-shadow-md">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border border-white/70 rounded-lg px-4 py-2 text-white placeholder-white/70 outline-none focus:border-green-400"
                      />
                      <FaLock className="absolute right-4 text-white/70" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 mt-2 text-white bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg shadow-lg transition duration-300"
                  >
                    Reset Password
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => { setStep(1); setShowForgotPassword(false); }}
                    className="text-sm text-center text-white hover:underline mt-1"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </>
          )}
          
        </div>
      </div>

      {/* Display the Footer at the bottom */}
      <Footer />
    </div>
  );
}