import Booking from "../models/booking.js";
import Bus from "../models/bus.js";
import Passenger from "../models/passenger.js";
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

// 4. Get bookings/manifest for operator's buses (Manual fetch to prevent MissingSchemaError)
export const getOperatorManifest = async (req, res) => {
    try {
        const operatorId = req.user.id; // From verifyToken middleware

        // 1. Find all buses belonging to this operator
        const operatorBuses = await Bus.find({ operatorId });
        const busIds = operatorBuses.map(bus => bus._id);

        // 2. Find all bookings for these buses and sort by newest first (createdAt: -1)
        const bookings = await Booking.find({ busId: { $in: busIds } }).sort({ createdAt: -1 });

        // 3. Manually fetch Passenger and Bus details without using .populate()
        const populatedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const passengerDetails = await Passenger.findById(booking.passengerId).select("fullName email phone");
                const busDetails = await Bus.findById(booking.busId).select("busName brNumber type routeNo amount departureTime");

                return {
                    ...booking._doc,
                    passengerId: passengerDetails || { fullName: "Unknown Passenger", phone: "N/A" },
                    busId: busDetails || { busName: "Bus N/A", brNumber: "N/A" }
                };
            })
        );

        res.status(200).json(populatedBookings);
    } catch (error) {
        console.error("Error fetching operator manifest:", error);
        res.status(500).json({ message: "Failed to fetch manifest", error: error.message });
    }
};

// 5. Delete a booking by operator
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Failed to delete booking", error: error.message });
    }
};

// 6. Get operator dashboard statistics and recent bookings (Fixed to avoid MissingSchemaError)
export const getOperatorDashboardStats = async (req, res) => {
    try {
        const operatorId = req.user?.id || req.user?.operatorId || req.user?._id;

        if (!operatorId) {
            return res.status(401).json({ message: "Unauthorized: Operator ID not found in token" });
        }

        // 1. Find all buses belonging to this operator
        const operatorBuses = await Bus.find({ operatorId });
        const busIds = operatorBuses.map(bus => bus._id);

        // 2. Total Buses Count
        const totalBuses = operatorBuses.length;

        // 3. Find all bookings for these buses (without .populate to prevent schema errors)
        const bookings = await Booking.find({ busId: { $in: busIds } }).sort({ createdAt: -1 });

        // 4. Manually fetch Passenger and Bus details for each booking
        const populatedBookings = await Promise.all(
            bookings.map(async (item) => {
                const passengerDetails = await Passenger.findById(item.passengerId).select("fullName phone");
                const busDetails = await Bus.findById(item.busId).select("busName brNumber departureTime amount");

                return {
                    ...item._doc,
                    passengerId: passengerDetails || { fullName: "Unknown Passenger", phone: "N/A" },
                    busId: busDetails || { busName: "Bus N/A", brNumber: "N/A", departureTime: "" }
                };
            })
        );

        // 5. Calculate Total Sales (sum of totalAmount of all bookings)
        const totalSales = populatedBookings.reduce((acc, booking) => acc + (booking.totalAmount || 0), 0);

        // 6. Total Seats Booked Count
        const totalSeatsBooked = populatedBookings.reduce((acc, booking) => {
            return acc + (booking.selectedSeats ? booking.selectedSeats.length : 0);
        }, 0);

        // 7. Format recent bookings for the dashboard table
        const recentBookings = populatedBookings.slice(0, 5).map(item => ({
            _id: item._id,
            busNumber: item.busId?.brNumber || item.busId?.busName || "N/A",
            dateTime: `${item.journeyDate || "N/A"} ${item.busId?.departureTime || ""}`,
            phone: item.passengerId?.phone || "N/A",
            passengerName: item.passengerId?.fullName || "Unknown Passenger",
            seats: item.selectedSeats ? item.selectedSeats.join(", ") : "N/A",
            status: "Paid"
        }));

        res.status(200).json({
            totalBuses,
            totalSales,
            totalSeatsBooked,
            recentBookings
        });
    } catch (error) {
        console.error("Error fetching operator dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
    }
};

// Get All Manifests for Super Admin (Manual fetch to prevent MissingSchemaError)
export const getAllManifestsForAdmin = async (req, res) => {
    try {
        // 1. Fetch all bookings on the platform, sorted by newest first
        const bookings = await Booking.find().sort({ createdAt: -1 });

        // 2. Manually fetch Passenger, Bus, and Operator details without using .populate()
        const populatedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const passengerDetails = await Passenger.findById(booking.passengerId).select("fullName email phone");
                const busDetails = await Bus.findById(booking.busId).select("busName brNumber type routeNo amount departureTime operatorId");
                
                // Fetch Operator details using the operatorId found in bus details
                let operatorDetails = { fullName: "N/A", companyName: "N/A" };
                if (busDetails && busDetails.operatorId) {
                    const foundOperator = await Passenger.findById(busDetails.operatorId).select("fullName companyName"); // නැතහොත් අදාළ Operator model එක භාවිතා කරන්න
                    if (foundOperator) {
                        operatorDetails = foundOperator;
                    }
                }

                return {
                    ...booking._doc,
                    passengerId: passengerDetails || { fullName: "Unknown Passenger", phone: "N/A" },
                    busId: busDetails ? { 
                        ...busDetails._doc, 
                        operatorId: operatorDetails 
                    } : { busName: "Bus N/A", brNumber: "N/A", operatorId: operatorDetails }
                };
            })
        );

        res.status(200).json(populatedBookings);
    } catch (error) {
        console.error("Backend Manifest Error:", error.message); 
        res.status(500).json({ message: "Failed to fetch all manifests", error: error.message });
    }
};