import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserTie, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminOperators() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || (role !== "admin" && role !== "superadmin")) {
      toast.error("Access Denied. Admin only.");
      navigate("/");
      return;
    }

    fetchOperators();
  }, [backendUrl, navigate]);

  const fetchOperators = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/operators/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setOperators(response.data);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
      toast.error("Failed to load operators");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    const actionText = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${actionText} this operator?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendUrl}/operators/admin/toggle-block/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Operator ${actionText}ed successfully!`);
      fetchOperators();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete operator: ${name}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/operators/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Operator deleted successfully!");
      setOperators(operators.filter(op => op._id !== id));
    } catch (error) {
      toast.error("Failed to delete operator");
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800 sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="logo" className="w-8 h-8 bg-white rounded-full p-1"/>
             <span className="font-bold text-xl tracking-tight">
               <span className="text-green-500">e</span>Bus Lanka
             </span>
           </div>
           <span className="font-bold text-lg">Super Admin</span>
        </div>

        {/* Page Content */}
        <div className="p-10 flex-grow relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaUserTie className="text-3xl text-green-500" />
              <h1 className="text-2xl font-bold">Manage Bus Operators</h1>
            </div>
            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-semibold border border-green-500/20">
              Total Operators: {operators.length}
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700">Operator Name</th>
                  <th className="p-4 border border-green-700">Company & BR</th>
                  <th className="p-4 border border-green-700">Contact Info</th>
                  <th className="p-4 border border-green-700 w-32">Status</th>
                  <th className="p-4 border border-green-700 w-36">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading operators...</td></tr>
                ) : operators.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50">No operators found.</td></tr>
                ) : (
                  operators.map((op) => (
                    <tr key={op._id} className="hover:bg-gray-50 border-b border-gray-300 transition">
                      <td className="p-4 border-r border-gray-300 text-left">
                        <div className="font-bold">{op.fullName}</div>
                        <div className="text-sm text-gray-500 font-normal">@{op.userName}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300 text-left">
                        <div>{op.companyName}</div>
                        <div className="text-sm text-gray-500">BR: {op.brNumber}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300 text-left text-sm">
                        <div>{op.email}</div>
                        <div className="text-gray-500">{op.phone}</div>
                      </td>
                      <td className="p-4 border-r border-gray-300">
                        {op.isBlocked ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleToggleBlock(op._id, op.isBlocked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${op.isBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                            title={op.isBlocked ? "Active Operator" : "Block Operator"}
                          >
                            {op.isBlocked ? <><FaCheckCircle /> Unblock</> : <><FaBan /> Block</>}
                          </button>
                          <button 
                            onClick={() => handleDelete(op._id, op.fullName)}
                            className="p-2 text-red-500 hover:text-red-700 transition"
                            title="Delete Operator"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}