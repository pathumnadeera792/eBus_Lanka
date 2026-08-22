import React from "react";

export default function BusCard({ bus }) {
  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      {/* Bus Image */}
      <img
        src="/bg-image.jpg" // Using the hero image as a placeholder for the bus
        alt="Bus"
        className="w-full h-48 object-cover"
      />
      
      {/* Bus Details */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="bg-green-600 px-3 py-1 text-sm font-bold rounded">
            {bus.numberPlate}
          </h3>
          <span className="text-green-400 font-bold">LKR {bus.price}</span>
        </div>
        
        <div className="text-sm space-y-2 text-gray-300">
          <p><span className="font-semibold text-white">Bus Name :</span> <span className="text-green-500">{bus.name}</span></p>
          <p><span className="font-semibold text-white">Available Seats :</span> <span className="text-green-500">{bus.seats}</span></p>
          <p><span className="font-semibold text-white">Route :</span> <span className="text-green-500">{bus.route}</span></p>
          <p><span className="font-semibold text-white">Departure Date :</span> <span className="text-green-500">{bus.date}</span></p>
          <p><span className="font-semibold text-white">Departure Time :</span> <span className="text-green-500">{bus.time}</span></p>
          <p><span className="font-semibold text-white">Type :</span> <span className="text-green-500">{bus.type}</span></p>
        </div>
      </div>
    </div>
  );
}