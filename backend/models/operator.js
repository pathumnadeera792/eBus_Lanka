import mongoose from "mongoose";



//create schema
const operatorSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        companyName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        brNumber: { type: String, required: true },
        dob: { type: Date },
        userName: { type: String, required: true, unique: true },
        address: { type: String },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        bankAccount: { type: String },
        role: { type: String, default: 'operator' },
        isApproved: { type: Boolean, default: false } 
    },
    { timestamps: true }
);


//create model
const Operator = mongoose.model("operators", operatorSchema);

export default Operator;