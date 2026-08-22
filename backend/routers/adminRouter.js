import express from "express";
import { createAdmin, loginAdmin, getPendingOperators, approveOperator } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/pending-operators", getPendingOperators);
adminRouter.put("/approve-operator/:id", approveOperator);

export default adminRouter;