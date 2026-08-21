import mongoose from "mongoose";
//create schema
const routeSchema = new mongoose.Schema(
    {
        routeId: { type: String, required: true, unique: true },
        startLocation: { type: String, required: true },
        endLocation: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

//create model
const Route = mongoose.model("routes", routeSchema);

export default Route;