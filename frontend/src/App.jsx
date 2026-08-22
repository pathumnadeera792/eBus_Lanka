import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import toaster for popup messages
import "./App.css";

// Import pages
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import BusPage from "./pages/busPage";
import TestPage from "./pages/testPage";
import ChooseLoginPage from "./pages/chooseLoginPage";
import AboutPage from "./pages/aboutPage";
import ContactPage from "./pages/contactPage";


function App() {
  return (
    <BrowserRouter>
      {/* Show toast messages at the top-right corner */}
      <Toaster position="top-right" />
      
      {/* Main container with Tailwind CSS */}
      <div className="w-full h-screen bg-blue-300">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bus" element={<BusPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/choose-login" element={<ChooseLoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;