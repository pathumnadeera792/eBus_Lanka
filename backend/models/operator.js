import mongoose from "mongoose";

// Schema Create for Bus Operator
const operatorSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dob: { type: Date },
        address: { type: String },
        phone: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        companyName: { type: String, required: true },
        brNumber: { type: String, required: true, unique: true },
        bankAccountDetails: { type: String, required: true }, 
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        securityQuestion: { type: String, required: true },
        answer: { type: String, required: true },
        role: { type: String, default: 'operator' },
        isBlocked: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false }, 
        image: { type: String },
    },
    { timestamps: true }
);

// Model Create
const Operator = mongoose.model("operators", operatorSchema);

export default Operator;