import Passenger from "../models/Passenger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//create passenger
export function createPassenger(req, res) {
    
    if(req.passenger == null){
        res.status(403).json({
            message: "You are not authorized to access this resource"
        })
        return;
    } 
    if(req.passenger.role != "admin"){
        res.status(403).json({
            message: "Please login as an admin to create a passenger"
        })
        return;
    }



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
        () => {
            res.json({
                message: "Error creating passenger"
            })
        }
    )
}

//login passenger
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

                    //create JWT token
                    const token = jwt.sign( {
                            id: passenger._id,
                            fullName: passenger.fullName,
                            userName: passenger.userName,
                            email: passenger.email,
                            role: passenger.role,
                            isBlocked: passenger.isBlocked,
                            isEmailVerified: passenger.isEmailVerified,
                            image: passenger.image
                        },"cbc-6503")
                        console.log(token);

                    res.json({
                        token: token,
                        message: "Login successful"
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
                error: err
            })
        }
    )
}