import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaIdCard, FaTimes } from "react-icons/fa";

// Import Sidebar
import AdminSidebar from "../../components/AdminSidebar";

export default function OperatorRequests() {
  const [pendingOperators, setPendingOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold selected operator for the modal
  const [selectedOperator, setSelectedOperator] = useState(null);
  
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch pending operators on load
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    
    if (role !== "superadmin") {
      toast.error("Access Denied.");
      navigate("/operator/login");
      return;
    }

    const fetchPendingOperators = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admins/operators/pending`);
        if (Array.isArray(response.data)) {
             setPendingOperators(response.data);
        } else {
             setPendingOperators([]);
        }
      } catch (error) {
        toast.error("Failed to load pending operators");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOperators();
  }, [navigate, backendUrl]);

  // Approve function
  const handleApprove = async (operatorId, operatorName) => {
    try {
      await axios.put(`${backendUrl}/admins/operators/approve/${operatorId}`);
      toast.success(`${operatorName} approved successfully!`);
      setPendingOperators(prev => prev.filter(op => op._id !== operatorId));
      
      // Close modal if open
      if(selectedOperator && selectedOperator._id === operatorId) setSelectedOperator(null);
    } catch (error) {
      toast.error("Failed to approve operator");
    }
  };

  // Reject function
  const handleReject = async (operatorId, operatorName) => {
    if(!window.confirm(`Are you sure you want to reject ${operatorName}?`)) return;

    try {
      await axios.delete(`${backendUrl}/admins/operators/reject/${operatorId}`);
      toast.success(`${operatorName} rejected!`);
      setPendingOperators(prev => prev.filter(op => op._id !== operatorId));
      
      // Close modal if open
      if(selectedOperator && selectedOperator._id === operatorId) setSelectedOperator(null);
    } catch (error) {
      toast.error("Failed to reject operator");
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      
      {/* Sidebar - Always visible */}
      <AdminSidebar />

      {/* Main Content Area - We make this relative to keep the modal inside it */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-800">
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
          <h1 className="text-2xl font-bold mb-8">Pending Operator Registrations</h1>

          {/* Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white font-bold text-center">
                <tr>
                  <th className="p-4 border border-green-700">Owner Name</th>
                  <th className="p-4 border border-green-700">Company Name</th>
                  <th className="p-4 border border-green-700">BR Numbers</th>
                  <th className="p-4 border border-green-700 w-24">View</th>
                  <th className="p-4 border border-green-700 w-32">Action</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-900 font-semibold text-center">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : pendingOperators.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50">No pending operator requests.</td></tr>
                ) : (
                  pendingOperators.map((operator) => (
                    <tr key={operator._id} className="hover:bg-gray-50 border-b border-gray-300">
                      <td className="p-4 border-r border-gray-300">{operator.fullName}</td>
                      <td className="p-4 border-r border-gray-300">{operator.companyName}</td>
                      <td className="p-4 border-r border-gray-300">{operator.brNumber}</td>
                      
                      {/* View Button */}
                      <td className="p-4 border-r border-gray-300">
                        <button 
                           onClick={() => setSelectedOperator(operator)}
                           className="text-blue-500 hover:text-blue-700 transition"
                           title="View Full Details"
                        >
                          <FaIdCard className="text-2xl mx-auto" />
                        </button>
                      </td>
                      
                      {/* Action Buttons */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => handleApprove(operator._id, operator.fullName)} className="text-green-600 hover:text-green-800 transition" title="Approve">
                              <FaCheckCircle className="text-2xl" />
                            </button>
                            <button onClick={() => handleReject(operator._id, operator.fullName)} className="text-red-500 hover:text-red-700 transition" title="Reject">
                              <FaTimesCircle className="text-2xl" />
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

        {/* --- Pop-up Modal Section (Now inside the right side only) --- */}
        {selectedOperator && (
          <div 
            // Absolute positioning keeps it strictly inside the main content area (doesn't cover sidebar)
            onClick={() => setSelectedOperator(null)} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div 
              // Smaller box (max-w-3xl), tighter padding (p-6)
              onClick={(e) => e.stopPropagation()} 
              className="bg-white text-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative max-h-full overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedOperator(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition text-2xl"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-bold mb-6 border-b-2 border-green-500 inline-block pb-1">
                Operator Details
              </h2>

              {/* Smaller gaps (gap-x-6 gap-y-4) to make it compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Full Name</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.fullName}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Company Name</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.companyName}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Email</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.email}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">BR Numbers</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.brNumber}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Date of Birth</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">
                    {selectedOperator.dob ? new Date(selectedOperator.dob).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Phone No</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.phone}</div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Address</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm">{selectedOperator.address}</div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Bank Account Details</label>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold text-sm whitespace-pre-wrap">{selectedOperator.bankAccountDetails}</div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-gray-200">
                  <button 
                    onClick={() => handleReject(selectedOperator._id, selectedOperator.fullName)}
                    className="px-5 py-2 bg-red-100 text-red-600 font-bold rounded-full hover:bg-red-200 transition text-sm"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedOperator._id, selectedOperator.fullName)}
                    className="px-5 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition shadow-md text-sm"
                  >
                    Approve Operator
                  </button>
              </div>

            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}