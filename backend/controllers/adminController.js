import Admin from "../models/Admin.js";
import Operator from "../models/Operator.js"; // Operator model import for approving operators
import Bus from "../models/bus.js";
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

// 3. Get Pending Operators to admin dashboard
export async function getPendingOperators(req, res) {
    try {
        // Find operators where isApproved is false, exclude password
        const pendingOperators = await Operator.find({ isApproved: false }, "-password"); 
        
        // Return DIRECT array to frontend to fix the loading issue
        res.status(200).json(pendingOperators);
    } catch (error) {
        res.status(500).json({ message: "Error fetching operators", error: error.message });
    }
}

// 4. Approve Operator 
export async function approveOperator(req, res) {
    try {
        const operatorId = req.params.id; // Get ID from URL
        
        // Update isApproved status to true
        const updatedOperator = await Operator.findByIdAndUpdate(
            operatorId, 
            { isApproved: true }, 
            { new: true }
        );

        if (!updatedOperator) {
            return res.status(404).json({ message: "Operator not found" });
        }

        res.status(200).json({ message: "Operator approved successfully", operator: updatedOperator });
    } catch (error) {
        res.status(500).json({ message: "Error approving operator", error: error.message });
    }
}

// 5. Reject and Delete Operator 
export async function rejectOperator(req, res) {
    try {
        const operatorId = req.params.id;
        
        // Delete the operator completely from database
        const deletedOperator = await Operator.findByIdAndDelete(operatorId);
        
        if (!deletedOperator) {
            return res.status(404).json({ message: "Operator not found" });
        }

        res.status(200).json({ message: "Operator rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting operator", error: error.message });
    }
}

// 6. Get Pending Buses (isApproved: false)
export async function getPendingBuses(req, res) {
    try {
        // Find buses and 'populate' to get operator details (name, company) linked to the bus
        const pendingBuses = await Bus.find({ isApproved: false })
            .populate("operatorId", "fullName companyName email phone"); 
            
        res.status(200).json(pendingBuses);
    } catch (error) {
        console.error("Error fetching pending buses:", error);
        res.status(500).json({ message: "Error fetching buses", error: error.message });
    }
}

// 7. Approve Bus
export async function approveBus(req, res) {
    try {
        const busId = req.params.id;
        const updatedBus = await Bus.findByIdAndUpdate(
            busId, 
            { isApproved: true }, 
            { new: true }
        );

        if (!updatedBus) return res.status(404).json({ message: "Bus not found" });
        res.status(200).json({ message: "Bus approved successfully", bus: updatedBus });
    } catch (error) {
        res.status(500).json({ message: "Error approving bus", error: error.message });
    }
}

// 8. Reject and Delete Buses
export async function rejectBus(req, res) {
    try {
        const busId = req.params.id;
        const deletedBus = await Bus.findByIdAndDelete(busId);
        
        if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
        res.status(200).json({ message: "Bus rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting bus", error: error.message });
    }
}
// 9. Get All Buses (for Super Admin Manage Buses page)
export async function getAllBuses(req, res) {
    try {
        // isApproved: true තියෙන (හෝ ඔක්කොම ඕන නම් ඒ filter එක අයින් කරන්න) බස් ගන්නවා
        const allBuses = await Bus.find({ isApproved: true }) 
            .populate("operatorId", "fullName companyName email phone"); 
            
        res.status(200).json(allBuses);
    } catch (error) {
        console.error("Error fetching all buses:", error);
        res.status(500).json({ message: "Error fetching buses", error: error.message });
    }
}