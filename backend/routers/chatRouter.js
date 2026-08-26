import express from "express";
import jwt from "jsonwebtoken";
import { handlePassengerChat } from "../controllers/chatController.js";

const chatRouter = express.Router();

// Inline Verify Token Middleware for Chat
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid or expired token" });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "Not authenticated. Token missing." });
    }
};

// Passenger chat route
chatRouter.post("/passenger-chat", verifyToken, handlePassengerChat);

export default chatRouter;