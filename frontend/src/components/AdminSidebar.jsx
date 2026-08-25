import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// FaFileAlt (Reports icon) එක ඉවත් කර ඇත
import { FaThLarge, FaUserPlus, FaBus, FaBusAlt, FaUserTie, FaUsers, FaMapMarkerAlt, FaStar, FaSignOutAlt } from 'react-icons/fa';

export default function AdminSidebar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/"; 
  };

  // Reports ලින්ක් එක ඉවත් කර ඇත
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaThLarge /> },
    { name: 'Op Requests', path: '/admin/operator-requests', icon: <FaUserPlus /> },
    { name: 'Bus Requests', path: '/admin/busRequests', icon: <FaBus /> },
    { name: 'Manage Buses', path: '/admin/manage-buses', icon: <FaBusAlt /> },
    { name: 'Operators', path: '/admin/operators', icon: <FaUserTie /> },
    { name: 'Passengers', path: '/admin/passengers', icon: <FaUsers /> },
    { name: 'Routes', path: '/admin/routes', icon: <FaMapMarkerAlt /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaStar /> },
  ];

  return (
    <div className="w-64 bg-zinc-800 min-h-screen flex flex-col">
      
      {/* Profile Area */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-700">
        <FaUserTie className="text-4xl text-white" />
        <span className="text-xl font-bold text-white">Super Admin</span>
      </div>

      {/* Nav Links */}
      <nav className="grow py-6 space-y-2 px-4">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition duration-200 
              ${location.pathname === link.path 
                ? 'bg-black text-green-500 shadow-md' 
                : 'text-gray-400 hover:text-green-400'}`}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 mb-4">
         <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition duration-200 w-full"
          >
            <span className="text-xl"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
      </div>
      
    </div>
  );
}