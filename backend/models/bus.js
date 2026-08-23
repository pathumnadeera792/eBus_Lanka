import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
    {
        busName: { type: String, required: true },
        brNumber: { type: String, required: true }, 
        routeNo: { type: String, required: true },
        departureDates: { type: String, required: true }, 
        date: { type: Date }, 
        departureTime: { type: String, required: true },
        departureLocation: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        capacity: { type: Number, required: true }, 
        type: { type: String, enum: ['AC', 'Non-AC', 'Luxury'], required: true },
        busImage: { type: String },
        amount: { type: Number, required: true }, 
        
        // identy bus operatore
        operatorId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'operators', // Operator model conect
            required: true 
        },
        isApproved: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Bus = mongoose.model("buses", busSchema);

export default Bus;