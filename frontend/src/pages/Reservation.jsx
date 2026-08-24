import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const bus = location.state?.bus;

  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // State for Custom Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    holderName: "",
    cvv: ""
  });

  useEffect(() => {
    if (!bus) {
      toast.error("No bus selected!");
      navigate("/find-bus");
      return;
    }
    fetchBookedSeats();
  }, [journeyDate]);

  const fetchBookedSeats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/bookings/booked-seats`, {
        params: { 
          busId: bus._id, 
          date: journeyDate,
          departureTime: bus.departureTime 
        }
      });
      setBookedSeats(response.data);
    } catch (error) {
      console.error("Error fetching booked seats", error);
    }
  };

  const handleSeatClick = (seatNo) => {
    if (bookedSeats.includes(seatNo)) return;

    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  // Open Payment Modal
  const handleProceedBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Handle Input Changes for Card Form
  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  // Process Mock Payment & Save Booking to Database
  const handlePayNow = async (e) => {
    e.preventDefault();

    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error("Please fill all card details");
      return;
    }

    const toastId = toast.loading("Processing payment...");

    try {
      const token = localStorage.getItem("token");
      const totalAmount = selectedSeats.length * bus.amount;

      const bookingData = {
        busId: bus._id,
        selectedSeats,
        totalAmount,
        journeyDate
      };

      // Simulate a small gateway delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await axios.post(`${backendUrl}/api/bookings/book`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Payment Successful & Seats Booked!", { id: toastId });
      setIsPaymentModalOpen(false);
      navigate("/passenger-reservations");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed", { id: toastId });
    }
  };

  // Dynamic Layout based on Bus Capacity (46 or 56)
  const renderSeats = () => {
    let currentSeat = 1;
    const capacity = Number(bus.capacity) || 56;

    if (capacity === 46) {
      return (
        <div className="flex flex-col gap-2 items-center bg-slate-900 p-6 rounded-2xl shadow-xl w-fit mx-auto border border-slate-800">
          <div className="text-white font-bold mb-3 text-xs uppercase tracking-wider text-green-400 border-b border-slate-700 pb-1 w-full text-center">
            Front / Driver Side (46 Seater - 2x2)
          </div>

          <div className="space-y-1.5 w-full">
            {Array.from({ length: 10 }).map((_, rowIndex) => {
              const left1 = currentSeat++;
              const left2 = currentSeat++;
              const right1 = currentSeat++;
              const right2 = currentSeat++;

              return (
                <div key={`row-46-${rowIndex}`} className="flex items-center justify-center gap-6">
                  <div className="flex gap-1.5">
                    {renderSeatButton(left1)}
                    {renderSeatButton(left2)}
                  </div>
                  <div className="w-8"></div>
                  <div className="flex gap-1.5">
                    {renderSeatButton(right1)}
                    {renderSeatButton(right2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full border-t border-dashed border-slate-700 my-2"></div>

          <div className="flex justify-center gap-1.5 w-full">
            {Array.from({ length: 6 }).map(() => {
              const seatNo = currentSeat++;
              return renderSeatButton(seatNo);
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-2 items-center bg-slate-900 p-6 rounded-2xl shadow-xl w-fit mx-auto border border-slate-800">
          <div className="text-white font-bold mb-3 text-xs uppercase tracking-wider text-green-400 border-b border-slate-700 pb-1 w-full text-center">
            Front / Driver Side (56 Seater - 2x3)
          </div>

          <div className="space-y-1.5 w-full">
            {Array.from({ length: 10 }).map((_, rowIndex) => {
              const left1 = currentSeat++;
              const left2 = currentSeat++;
              const right1 = currentSeat++;
              const right2 = currentSeat++;
              const right3 = currentSeat++;

              return (
                <div key={`row-56-${rowIndex}`} className="flex items-center justify-center gap-6">
                  <div className="flex gap-1.5">
                    {renderSeatButton(left1)}
                    {renderSeatButton(left2)}
                  </div>
                  <div className="w-6"></div>
                  <div className="flex gap-1.5">
                    {renderSeatButton(right1)}
                    {renderSeatButton(right2)}
                    {renderSeatButton(right3)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full border-t border-dashed border-slate-700 my-2"></div>

          <div className="flex justify-center gap-1.5 w-full">
            {Array.from({ length: 6 }).map(() => {
              const seatNo = currentSeat++;
              return renderSeatButton(seatNo);
            })}
          </div>
        </div>
      );
    }
  };

  const renderSeatButton = (seatNo) => {
    const isBooked = bookedSeats.includes(seatNo);
    const isSelected = selectedSeats.includes(seatNo);

    let bgColor = "bg-green-600 hover:bg-green-500 text-white"; 
    if (isBooked) bgColor = "bg-red-600 text-white cursor-not-allowed"; 
    if (isSelected) bgColor = "bg-black text-white border-2 border-green-400"; 

    return (
      <button
        key={seatNo}
        onClick={() => handleSeatClick(seatNo)}
        disabled={isBooked}
        className={`w-8 h-8 rounded-md font-bold text-[11px] flex items-center justify-center shadow transition-all ${bgColor}`}
      >
        {seatNo}
      </button>
    );
  };

  if (!bus) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans relative">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-10 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">User Reservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Available Seats</h2>
            
            {renderSeats()}

            <div className="flex items-center gap-6 mt-8 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-600 rounded"></span> Reserved
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-600 rounded"></span> Available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-black rounded"></span> My Bookings
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Bus Details</h2>
              
              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Bus Name:</span> <span className="font-bold text-gray-900 text-base">{bus.busName}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Route No:</span> <span className="font-bold text-gray-900">{bus.routeNo}</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">Journey Date:</span> 
                  <input 
                    type="date" 
                    value={journeyDate} 
                    onChange={(e) => setJourneyDate(e.target.value)} 
                    className="border px-3 py-1.5 rounded-lg text-sm font-bold bg-white text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Departure Time:</span> <span className="font-bold text-gray-900">{bus.departureTime}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Route:</span> <span className="font-bold text-gray-900">{bus.departureLocation} → {bus.destination}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-gray-500">Type:</span> <span className="font-bold text-green-600">{bus.type}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Ticket Price:</span> <span className="font-bold text-gray-900">LKR {bus.amount}</span></div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Book Seats Details</h2>
              <div className="space-y-3 text-sm text-gray-700 bg-green-50/50 p-5 rounded-xl border border-green-200 shadow-sm">
                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Seat Count:</span> <span className="font-extrabold text-gray-900 text-base">{selectedSeats.length}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Seat ID(s):</span> <span className="font-extrabold text-green-700 bg-white px-2.5 py-1 rounded border border-green-200">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-green-200 text-base font-bold text-green-800"><span>Total Amount:</span> <span className="text-xl font-black text-green-700">LKR {selectedSeats.length * bus.amount}</span></div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleProceedBooking}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-center block mb-3 text-base"
              >
                Pay & Book Now
              </button>
              <button 
                onClick={() => navigate("/find-bus")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-center block text-base"
              >
                Cancel
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* --- CUSTOM PAYMENT MODAL (Matching your prototype Frame 3 design) --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative border border-gray-200">
            
            {/* Close button */}
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl font-bold"
            >
              ✕
            </button>

            {/* Visa / MasterCard Logos Header */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="border rounded-lg px-3 py-1 shadow-sm font-extrabold text-blue-800 italic tracking-wider">VISA</div>
              <div className="border rounded-lg px-3 py-1 shadow-sm font-bold text-red-600">MasterCard</div>
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 text-center mb-6">Credit/Debit Card Details</h3>

            <form onSubmit={handlePayNow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber" 
                  placeholder="4532 •••• •••• ••••" 
                  maxLength="19"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">MM/YY</label>
                  <input 
                    type="text" 
                    name="expiry" 
                    placeholder="MM/YY" 
                    maxLength="5"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Card Holder Name</label>
                  <input 
                    type="text" 
                    name="holderName" 
                    placeholder="Pathum Nadeera" 
                    value={cardDetails.holderName}
                    onChange={handleCardChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">CVV</label>
                <input 
                  type="password" 
                  name="cvv" 
                  placeholder="123" 
                  maxLength="4"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-center"
                >
                  Pay Now (LKR {selectedSeats.length * bus.amount})
                </button>
                <button 
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-center"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}