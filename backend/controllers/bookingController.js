import Booking from "../models/booking.js";
import Bus from "../models/bus.js";
import crypto from "crypto";

// 1. Get booked seats for a specific bus, date, and departure time (ignoring expired/past trips)
export const getBookedSeats = async (req, res) => {
    try {
        const { busId, date, departureTime } = req.query;
        
        // Find bookings for this bus and date
        const bookings = await Booking.find({ busId, journeyDate: date });
        
        const now = new Date(); // Current system date & time

        // Filter valid (non-expired) bookings based on departure time
        const validBookings = bookings.filter(booking => {
            if (!departureTime) return true; // If time is not provided, fallback to date matching

            // Combine journeyDate and departureTime to get exact trip end/start datetime
            const tripDateTime = new Date(`${booking.journeyDate}T${departureTime}:00`);

            // If the trip time has passed compared to 'now', consider it expired (reset seats)
            if (now > tripDateTime) {
                return false; 
            }
            return true;
        });
        
        // Flatten all selected seats from valid/active bookings into a single array
        const bookedSeats = validBookings.reduce((acc, booking) => acc.concat(booking.selectedSeats), []);
        
        res.status(200).json(bookedSeats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch booked seats", error: error.message });
    }
};

// 2. Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { busId, selectedSeats, totalAmount, journeyDate } = req.body;
        const passengerId = req.user.id; // From verifyToken middleware

        if (!selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ message: "No seats selected" });
        }

        const newBooking = new Booking({
            busId,
            passengerId,
            selectedSeats,
            totalAmount,
            journeyDate
        });

        await newBooking.save();
        res.status(201).json({ message: "Seats booked successfully!", booking: newBooking });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
};

// 3. Get bookings for the logged-in passenger (Fixed without populate naming errors)
export const getMyBookings = async (req, res) => {
    try {
        const passengerId = req.user.id; 
        console.log("Fetching bookings for passengerId:", passengerId);

        // 1. Fetch all bookings of this passenger
        const bookings = await Booking.find({ passengerId }).sort({ createdAt: -1 });

        // 2. Attach bus details directly using imported Bus model (bypasses MissingSchemaError completely)
        const populatedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const busDetails = await Bus.findById(booking.busId).select("busName departureLocation destination amount routeNo departureTime");
                return {
                    ...booking._doc,
                    busId: busDetails || { busName: "Bus N/A", departureLocation: "N/A", destination: "N/A" }
                };
            })
        );
        
        res.status(200).json(populatedBookings);
    } catch (error) {
        console.error("Detailed Server Error in getMyBookings:", error); 
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
};