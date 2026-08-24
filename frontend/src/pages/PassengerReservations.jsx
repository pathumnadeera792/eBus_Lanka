import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf"; // PDF Download සඳහා

export default function Reservations() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Passenger's Bookings on Page Load
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${backendUrl}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMyBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
        toast.error("Failed to load reservations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, [backendUrl, navigate]);

  // Download e-Ticket PDF function
  const downloadTicketPDF = (booking) => {
    const doc = new jsPDF();

    // PDF Design
    doc.setFillColor(22, 163, 74); // Green header
    doc.rect(0, 0, 210, 40, "f");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("eBus Lanka - E-Ticket", 15, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Booking ID: B0${booking._id.slice(-4)}`, 15, 55);
    doc.text(`Journey Date: ${booking.journeyDate}`, 15, 65);
    doc.text(`Route: ${booking.busId?.departureLocation || "Colombo"} - ${booking.busId?.destination || "Kandy"}`, 15, 75);
    doc.text(`Bus Name: ${booking.busId?.busName || "Standard Bus"}`, 15, 85);
    doc.text(`Seat Number(s): ${booking.selectedSeats.join(", ")}`, 15, 95);
    doc.text(`Total Paid: LKR ${booking.totalAmount}`, 15, 105);
    doc.text(`Status: Confirmed`, 15, 115);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for traveling with eBus Lanka!", 15, 140);

    // Save PDF
    doc.save(`eTicket-${booking._id.slice(-4)}.pdf`);
    toast.success("e-Ticket downloaded successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <div 
        className="relative w-full h-[35vh] bg-cover bg-center flex items-center justify-center shadow-md"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Recent Reservation
          </h1>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-5xl mx-auto w-full px-6 py-16 flex-grow">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-700 text-white font-bold text-sm uppercase tracking-wider">
                  <th className="p-4 text-center">Booking ID</th>
                  <th className="p-4">Route</th>
                  <th className="p-4 text-center">Date</th>
                  <th className="p-4 text-center">Seat</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Save PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">Loading your reservations...</td>
                  </tr>
                ) : myBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No reservations found yet.</td>
                  </tr>
                ) : (
                  myBookings.map((booking, index) => (
                    <tr key={booking._id} className="hover:bg-green-50/50 transition">
                      <td className="p-4 text-center font-bold text-gray-900">
                        B0{booking._id.slice(-4)}
                      </td>
                      <td className="p-4 font-semibold text-gray-700">
                        {booking.busId?.departureLocation || "Colombo"} → {booking.busId?.destination || "Destination"}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {booking.journeyDate}
                      </td>
                      <td className="p-4 text-center font-bold text-green-700">
                        {booking.selectedSeats.join(", ")}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                          Confirmed
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => downloadTicketPDF(booking)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg shadow transition inline-flex items-center justify-center"
                          title="Download e-Ticket PDF"
                        >
                          <FaDownload className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}