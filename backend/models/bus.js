import mongoose from "mongoose";

//create schema
const busSchema = new mongoose.Schema(
    {
        operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'operators', required: true },
        busName: { type: String, required: true },
        brNumber: { type: String, required: true },
        routeNo: { type: String, required: true },
        fromLocation: { type: String, required: true },
        toLocation: { type: String, required: true },
        departureTime: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        departureDates: { type: String, required: true },
        type: { type: String, required: true }, 
        capacity: { type: Number, required: true },
        ticketPrice: { type: Number, required: true },
        busImage: { type: String }
    },
    { timestamps: true }
);

//create model
const Bus = mongoose.model("buses", busSchema);

export default Bus;