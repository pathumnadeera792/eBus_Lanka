import express from "express";
import jwt from "jsonwebtoken";
import { getBookedSeats, createBooking, getMyBookings } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

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

bookingRouter.get("/booked-seats", getBookedSeats);
bookingRouter.post("/book", verifyToken, createBooking);
bookingRouter.get("/my-bookings", verifyToken, getMyBookings);

export default bookingRouter;