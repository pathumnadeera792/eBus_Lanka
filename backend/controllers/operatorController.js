import Operator from "../models/Operator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create Operator (Registration)
export const createOperator = async (req, res) => {
    try {
        const passwordHash = bcrypt.hashSync(req.body.password, 10);

        const operatorData = {
            fullName: req.body.fullName,
            companyName: req.body.companyName,
            email: req.body.email,
            brNumber: req.body.brNumber,
            dob: req.body.dob,
            userName: req.body.userName,
            address: req.body.address,
            phone: req.body.phone,
            gender: req.body.gender,
            bankAccountDetails: req.body.bankAccountDetails, 
            securityQuestion: req.body.securityQuestion,
            answer: req.body.answer,
            
            password: passwordHash,
            // isApproved admin approval
            isApproved: false 
        };

        const operator = new Operator(operatorData);
        await operator.save();

        res.status(201).json({
            message: "Operator registered successfully. Please wait for Super Admin approval."
        });

    } catch (error) {
        console.error("Operator Registration Error: ", error); // Backend terminal find error
        res.status(500).json({
            message: "Error registering operator",
            error: error.message
        });
    }
}

// Login Operator (Now using Email)
export const loginOperator = async (req, res) => {
    try {
        // Frontend email
        const email = req.body.email; 
        const password = req.body.password;

        // email find by db
        const operator = await Operator.findOne({ email: email });

        if (!operator) {
            return res.status(404).json({
                message: "Operator not found"
            });
        }

        // Super Admin approve check
        if (!operator.isApproved) {
            return res.status(403).json({
                message: "Your account is not approved yet. Please contact Super Admin.",
                isApproved: false
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, operator.password);

        if (isPasswordCorrect) {
            const token = jwt.sign({
                id: operator._id,
                fullName: operator.fullName,
                userName: operator.userName,
                email: operator.email,
                role: operator.role
            }, process.env.JWT_SECRET, { expiresIn: "1d" });

            res.json({
                message: "Login successful",
                token: token,
                isApproved: true,
                user: {
                    fullName: operator.fullName,
                    companyName: operator.companyName,
                    role: operator.role
                }
            });
        } else {
            res.status(403).json({
                message: "Invalid password"
            });
        }

    } catch (error) {
        console.error("Operator Login Error: ", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
}