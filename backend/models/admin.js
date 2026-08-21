import mongoose from "mongoose";


//create schema
const adminSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'superadmin' }
    },
    { timestamps: true }
);

//create model
const Admin = mongoose.model("admins", adminSchema);

export default Admin;