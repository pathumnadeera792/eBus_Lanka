import Passenger from "../models/Passenger.js";
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
        password: passwordHash
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