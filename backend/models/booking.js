import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selectedSeats: { type: [Number], required: true }, // [26, 27] වගේ සීට් නම්බර්ස්
    totalAmount: { type: Number, required: true },
    journeyDate: { type: String, required: true },
    status: { type: String, default: "Confirmed" } // Confirmed / Cancelled
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);