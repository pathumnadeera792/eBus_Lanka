import React from "react";
import { FaBus, FaCalendarAlt, FaClock, FaUsers, FaTag } from "react-icons/fa";

export default function BusCard({ bus }) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 text-white flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
      
      {/* Bus Image */}
      <div className="relative h-36 w-full bg-slate-800">
        <img 
          src={bus.busImage || "/placeholder-bus.jpg"} 
          alt={bus.busName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
          {bus.type || "Standard"}
        </div>
      </div>

      {/* Bus Info Section */}
      <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
        
        <div>
          {/* Price and Bus Name Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white tracking-wide truncate max-w-[60%]">{bus.busName}</h3>
            <div className="text-green-400 font-extrabold text-base">
              LKR {bus.amount}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-2">
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FaBus className="text-green-500 text-xs" /> Reg / BR:
              </span>
              <span className="font-semibold text-white">{bus.brNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FaUsers className="text-green-500 text-xs" /> Capacity:
              </span>
              <span className="font-semibold text-white">{bus.capacity} Seats</span>
            </div>

            {/* Route: From -> To (Destination) */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FaTag className="text-green-500 text-xs" /> Route:
              </span>
              <span className="font-semibold text-green-400 truncate max-w-[60%]">
                {bus.departureLocation} → {bus.destination || "N/A"}
              </span>
            </div>

            {/* Route Number */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FaBus className="text-green-500 text-xs" /> Route No:
              </span>
              <span className="font-semibold text-white">{bus.routeNo}</span>
            </div>

            {/* Dates / Schedules */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1.5 pt-0.5">
                <FaCalendarAlt className="text-green-500 text-xs" /> Schedule:
              </span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                {Array.isArray(bus.departureDates) ? (
                  bus.departureDates.map((dateItem, idx) => (
                    <span key={idx} className="bg-slate-800 text-green-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700">
                      {dateItem}
                    </span>
                  ))
                ) : (
                  <span className="font-semibold text-white">{bus.departureDates}</span>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FaClock className="text-green-500 text-xs" /> Time:
              </span>
              <span className="font-semibold text-white">{bus.departureTime} - {bus.arrivalTime}</span>
            </div>

          </div>
        </div>

        {/* Book Button */}
        <div className="pt-2">
          <button 
            onClick={() => alert(`Booking feature for ${bus.busName} coming soon!`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition shadow text-center block text-sm"
          >
            Book Seat
          </button>
        </div>

      </div>

    </div>
  );
}