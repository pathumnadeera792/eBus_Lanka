import express from "express";
import { createAdmin, loginAdmin, getPendingOperators, approveOperator, rejectOperator } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/operators/pending", getPendingOperators);
adminRouter.put("/operators/approve/:id", approveOperator); // මෙතන PUT තියෙන්න ඕනේ
adminRouter.delete("/operators/reject/:id", rejectOperator);

export default adminRouter;