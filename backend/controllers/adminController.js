import Admin from "../models/Admin.js";
import Operator from "../models/Operator.js"; // Operator model import for approving operators
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Create Super Admin one time only (Public Registration)
export async function createAdmin(req, res) {
    console.log(req.body);
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        
        const adminData = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: passwordHash
        };

        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        res.status(201).json({ message: "Super Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
}

// 2. Login Super Admin
export async function loginAdmin(req, res) {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);
        
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: { fullName: admin.fullName, role: admin.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
}

// 3. Get Pending Operators to admin dashboard (isApproved: false operators)
export async function getPendingOperators(req, res) {
    try {
        // isApproved: false operators gain
        const pendingOperators = await Operator.find({ isApproved: false }, "-password"); // -password to exclude password field from the response
        res.json({ operators: pendingOperators });
    } catch (error) {
        res.status(500).json({ message: "Error fetching operators", error: error.message });
    }
}

// 4. Approve Operator (Status change from isApproved: false to isApproved: true)
export async function approveOperator(req, res) {
    try {
        const operatorId = req.params.id; // Gain the operator ID from the request parameters
        
        const updatedOperator = await Operator.findByIdAndUpdate(
            operatorId, 
            { isApproved: true }, 
            { new: true }
        );

        if (!updatedOperator) {
            return res.status(404).json({ message: "Operator not found" });
        }

        res.json({ message: "Operator approved successfully", operator: updatedOperator });
    } catch (error) {
        res.status(500).json({ message: "Error approving operator", error: error.message });
    }
}