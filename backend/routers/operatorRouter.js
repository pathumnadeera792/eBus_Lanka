import express from "express";
import jwt from "jsonwebtoken";
import { createOperator, loginOperator, updateOperatorProfile, getOperatorProfile, getAllOperators,deleteOperator, toggleOperatorStatus } from "../controllers/operatorController.js";

const operatorRouter = express.Router();

// --- Verify Token Middleware ---
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

operatorRouter.post("/register", createOperator); // Route for operator registration
operatorRouter.post("/login", loginOperator); // Route for operator login
operatorRouter.get("/profile", verifyToken, getOperatorProfile);
operatorRouter.put("/profile", verifyToken, updateOperatorProfile);
operatorRouter.get("/admin/all", verifyToken, getAllOperators);
operatorRouter.put("/admin/toggle-block/:id", verifyToken, toggleOperatorStatus);
operatorRouter.delete("/admin/delete/:id", verifyToken, deleteOperator);

export default operatorRouter;