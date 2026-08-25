import Operator from "../models/Operator.js";
import Bus from "../models/bus.js"; // Bus model එක මෙතනට import කරගන්න ඕනේ
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
            isApproved: false 
        };

        const operator = new Operator(operatorData);
        await operator.save();

        res.status(201).json({
            message: "Operator registered successfully. Please wait for Super Admin approval."
        });

    } catch (error) {
        console.error("Operator Registration Error: ", error);
        res.status(500).json({
            message: "Error registering operator",
            error: error.message
        });
    }
}

// Login Operator (Now using Email)
export const loginOperator = async (req, res) => {
    try {
        const email = req.body.email; 
        const password = req.body.password;

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

        // --- Check if Operator is Blocked ---
        if (operator.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by Super Admin. Please contact support.",
                isBlocked: true
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

// Get Operator Profile
export const getOperatorProfile = async (req, res) => {
    try {
        const operatorId = req.user?.id || req.user?.operatorId || req.user?._id;
        const operator = await Operator.findById(operatorId).select("-password");
        if (!operator) {
            return res.status(404).json({ message: "Operator not found" });
        }
        res.status(200).json(operator);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Operator Profile
export const updateOperatorProfile = async (req, res) => {
    try {
        const operatorId = req.user?.id || req.user?.operatorId || req.user?._id;
        const { fullName, email, phone, address } = req.body;

        const updatedOperator = await Operator.findByIdAndUpdate(
            operatorId,
            { fullName, email, phone, address },
            { returnDocument: 'after' }
        ).select("-password");

        res.status(200).json({ message: "Profile updated successfully", operator: updatedOperator });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

// Get all operators for Admin
export const getAllOperators = async (req, res) => {
    try {
        const operators = await Operator.find().select("-password");
        res.status(200).json(operators);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch operators", error: error.message });
    }
};

// Toggle Block/Active status for operator
export const toggleOperatorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const operator = await Operator.findById(id);
        if (!operator) return res.status(404).json({ message: "Operator not found" });

        operator.isBlocked = !operator.isBlocked;
        await operator.save();
        res.status(200).json({ message: `Operator status updated to ${operator.isBlocked ? "Blocked" : "Active"}`, isBlocked: operator.isBlocked });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};

// Delete operator and all their buses
export const deleteOperator = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete all buses belonging to this operator
        await Bus.deleteMany({ operatorId: id });

        // Delete the operator
        await Operator.findByIdAndDelete(id);

        res.status(200).json({ message: "Operator and associated buses deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete operator", error: error.message });
    }
};