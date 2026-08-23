import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaThLarge, FaBus, FaClipboardList, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function OperatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active link

  // Handle Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/"; // Refresh and redirect to home
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
      
      {/* Brand Name from image_5.png */}
      <div className="text-2xl font-bold text-white mb-16 flex items-center gap-2">
        <span className="text-green-500">Bus</span> Operator
      </div>

      {/* Navigation Links with icons and simple active highlighting */}
      <nav className="flex-grow space-y-3">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition duration-200 
              ${location.pathname === link.path 
                ? 'bg-green-600/20 text-green-400' 
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
        className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition duration-200 w-full"
      >
        <span className="text-xl"><FaSignOutAlt /></span>
        <span>Logout</span>
      </button>
    </div>
  );
}