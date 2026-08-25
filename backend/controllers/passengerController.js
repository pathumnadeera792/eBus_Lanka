import Passenger from "../models/passenger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create Passenger (Public Registration)
export function createPassenger(req, res) {

    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    const passengerData = {
        fullName: req.body.fullName,
        userName: req.body.userName,
        email: req.body.email,
        dob: req.body.dob,
        address: req.body.address,
        phone: req.body.phone,
        gender: req.body.gender,
        password: passwordHash,
        securityQuestion: req.body.securityQuestion,
        answer: req.body.answer
    };

    const passenger = new Passenger(passengerData);
    
    passenger.save().then(
        () => {
            res.status(201).json({
                message: "Passenger created successfully"
            })
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error creating passenger",
                error: err.message 
            })
        }
    )
}

// Login Passenger
export function loginPassenger(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    Passenger.findOne({ email: email }).then(
        (passenger) => {
            if (passenger == null) {
                res.status(404).json({
                    message: "Passenger not found"
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, passenger.password)
                
                if (isPasswordCorrect) {
                    // Create JWT token (.env using dotenv package)
                    const token = jwt.sign( {
                            id: passenger._id,
                            fullName: passenger.fullName,
                            userName: passenger.userName,
                            email: passenger.email,
                            role: passenger.role
                        }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Token expires in 1 day

                    res.json({
                        message: "Login successful",
                        token: token,
                        user: {
                            fullName: passenger.fullName,
                            role: passenger.role
                        }
                    })
                } else {
                    res.status(403).json({
                        message: "Invalid password"
                    })
                }
            }
        }   
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error logging in",
                error: err.message
            })
        }
    )
}

// Get Passenger Profile
export const getPassengerProfile = async (req, res) => {
    try {
        const passengerId = req.passenger.id; // req.user වෙනුවට req.passenger පාවිච්චි කරන්න
        const passenger = await Passenger.findById(passengerId).select("-password");
        if (!passenger) {
            return res.status(404).json({ message: "Passenger not found" });
        }
        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Passenger Profile
export const updatePassengerProfile = async (req, res) => {
    try {
        const passengerId = req.passenger.id; // req.user වෙනුවට req.passenger පාවිච්චි කරන්න
        const { fullName, phone, address } = req.body;

        const updatedPassenger = await Passenger.findByIdAndUpdate(
            passengerId,
            { fullName, phone, address },
            { new: true }
        ).select("-password");

        res.status(200).json({ message: "Profile updated successfully", passenger: updatedPassenger });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

