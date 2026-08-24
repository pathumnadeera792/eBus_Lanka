import express from "express";
import { createAdmin, loginAdmin, getPendingOperators, approveOperator, rejectOperator, getPendingBuses, approveBus, rejectBus, getAllBuses } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/operators/pending", getPendingOperators);
adminRouter.put("/operators/approve/:id", approveOperator); 
adminRouter.delete("/operators/reject/:id", rejectOperator);
adminRouter.get("/buses/pending", getPendingBuses);
adminRouter.put("/buses/approve/:id", approveBus);
adminRouter.delete("/buses/reject/:id", rejectBus);
adminRouter.get("/buses/all", getAllBuses);

export default adminRouter;