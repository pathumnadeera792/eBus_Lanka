import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // Sticky Navbar with glassmorphism effect (stays on top when scrolling)
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-green-100 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      {/* Logo Section (Clickable to go Home) */}
      <Link to="/" className="flex items-center gap-3 group">
        
        {/* Logo Image Container */}
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          {/* Make sure logo.png is in your public folder */}
          <img 
            src="/logo.png" 
            alt="eBus Lanka Logo" 
            className="w-full h-full object-contain p-1" 
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          <span className="text-green-600">e</span>Bus Lanka
        </h1>
      </Link>

      {/* Center Navigation Links (Hidden on mobile screens) */}
      <div className="hidden md:flex gap-8 font-medium text-gray-600">
        <Link to="/" className="hover:text-green-600 transition duration-300">
          Home
        </Link>
        <Link to="/about" className="hover:text-green-600 transition duration-300">
          About
        </Link>
        <Link to="/contact" className="hover:text-green-600 transition duration-300">
          Contact
        </Link>
      </div>

      {/* Right Side - Sign Up Button */}
      <div>
        <Link to="/register">
          <button className="px-6 py-2 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            Sign Up
          </button>
        </Link>
      </div>
      
    </nav>
  );
}