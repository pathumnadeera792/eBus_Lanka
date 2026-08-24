import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaThLarge, FaBus, FaClipboardList, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function OperatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [operatorName, setOperatorName] = useState("Operator");

  // Fetch operator name from localStorage on load
  useEffect(() => {
    // Assuming you store user info in localStorage during login
    const storedUser = localStorage.getItem("userName") || localStorage.getItem("fullName");
    if (storedUser) {
      setOperatorName(storedUser);
    }
  }, []);

  // Function to get initials from name (e.g., "Pathum Nadeera" -> "PN")
  const getInitials = (name) => {
    if (!name) return "OP";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "/"; 
  };

  const navLinks = [
    { name: 'Dashboard', path: '/operator/dashboard', icon: <FaThLarge /> },
    { name: 'My Buses', path: '/operator/buses', icon: <FaBus /> },
    { name: 'Manifest', path: '/operator/manifest', icon: <FaClipboardList /> },
    { name: 'Reports', path: '/operator/reports', icon: <FaFileAlt /> },
    { name: 'Setting', path: '/operator/settings', icon: <FaCog /> },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-6 flex flex-col border-r border-gray-800">
      
      {/* Profile Area with Initials Avatar */}
      <div className="flex items-center gap-3 pb-6 mb-8 border-b border-gray-800">
        <div className="w-12 h-12 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-lg shadow-md border-2 border-green-400">
          {getInitials(operatorName)}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-white font-bold text-base truncate">{operatorName}</h3>
          <span className="text-xs text-green-400 font-semibold uppercase tracking-wider">Operator</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-3">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition duration-200 
              ${location.pathname === link.path 
                ? 'bg-green-600/20 text-green-400 shadow-sm' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout button at the bottom */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition duration-200 w-full mt-auto"
      >
        <span className="text-xl"><FaSignOutAlt /></span>
        <span>Logout</span>
      </button>
      
    </div>
  );
}