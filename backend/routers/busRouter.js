import express from "express";
import jwt from "jsonwebtoken";
import { addBus, getOperatorBuses, updateBus, deleteBus } from "../controllers/busController.js";

const busRouter = express.Router();

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is invalid or expired!" });
            }
            req.user = user; // Attach user details to request
            next();
        });
    } else {
        return res.status(401).json({ message: "You are not authenticated!" });
    }
};

// All routes are protected with verifyToken middleware
busRouter.post("/add", verifyToken, addBus); 
busRouter.get("/my-buses", verifyToken, getOperatorBuses); 
busRouter.put("/update/:id", verifyToken, updateBus); 
busRouter.delete("/delete/:id", verifyToken, deleteBus); 

export default busRouter;