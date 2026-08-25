import express from "express";
import jwt from "jsonwebtoken";
import { 
    createPassenger, 
    loginPassenger, 
    updatePassengerProfile, 
    getPassengerProfile,
    getAllPassengers,
    togglePassengerStatus,
    deletePassenger


} from "../controllers/passengerController.js";

const passengerRouter = express.Router();

// --- Verify Token Middleware ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "Not authenticated" });
    }
};

passengerRouter.post("/register", createPassenger);
passengerRouter.post("/login", loginPassenger);
passengerRouter.get("/profile", verifyToken, getPassengerProfile);
passengerRouter.put("/profile", verifyToken, updatePassengerProfile);
passengerRouter.get("/admin/all", verifyToken, getAllPassengers);
passengerRouter.put("/admin/toggle-block/:id", verifyToken, togglePassengerStatus);
passengerRouter.delete("/admin/delete/:id", verifyToken, deletePassenger);

export default passengerRouter;