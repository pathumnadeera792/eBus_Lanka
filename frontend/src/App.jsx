import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import toaster for popup messages
import "./App.css";

// Import pages
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ChooseLoginPage from "./pages/chooseLoginPage";
import AboutPage from "./pages/aboutPage";
import ContactPage from "./pages/contactPage";
import RegisterPage from "./pages/registerPage";
import FindBusPage from "./pages/findBusPage";

//operator
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import OperatorRegisterPage from "./pages/operator/RegisterPage";
import OperatorLoginPage from "./pages/operator/LoginPage";
import MyBuses from "./pages/operator/MyBuses";

//admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorRequests from "./pages/admin/OperatorRequests";
import BusRequests from "./pages/admin/BusRequests";
import ManageBuses from "./pages/admin/ManageBuses";



function App() {
  return (
    <BrowserRouter>
      {/* Show toast messages at the top-right corner */}
      <Toaster position="top-right" />
      
      {/* Main container with Tailwind CSS */}
      <div className="w-full min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/choose-login" element={<ChooseLoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/find-bus" element={<FindBusPage/>}/>

          {/* Operator Routes */}
          <Route path="/operator/dashboard" element={<OperatorDashboard />} />
          <Route path="/operator/register" element={<OperatorRegisterPage />} />
          <Route path="/operator/login" element={<OperatorLoginPage />} />
          <Route path="/operator/buses" element={<MyBuses />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/operator-requests" element={<OperatorRequests />} />
          <Route path="/admin/busRequests" element={<BusRequests />} />
          <Route path="/admin/manage-buses" element={<ManageBuses />} />


        </Routes> 
      </div>
    </BrowserRouter>
  );
}

export default App;