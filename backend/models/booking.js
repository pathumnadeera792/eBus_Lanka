import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'buses', required: true },
        passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'passengers', required: true }, 
        passengerName: { type: String, required: true },
        passengerPhone: { type: String, required: true },
        journeyDate: { type: Date, required: true },
        seats: [{ type: String, required: true }], 
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Pending' }
    },
    { timestamps: true }
);

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;