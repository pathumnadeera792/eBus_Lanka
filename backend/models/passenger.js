import mongoose from "mongoose";


//schema create
const passengerSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        userName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        dob: { type: Date },
        address: { type: String },
        phone: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        password: { type: String, required: true },
        role: { type: String, default: 'passenger' },
        isBlocked: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
        image: { type: String },
    },
    { timestamps: true }
);

//model create
const Passenger = mongoose.model("passengers", passengerSchema);

export default Passenger;