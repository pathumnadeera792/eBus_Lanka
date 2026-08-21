import express from "express";
import { createOperator, loginOperator } from "../controllers/operatorController.js";

const operatorRouter = express.Router();

operatorRouter.post("/register", createOperator); // Route for operator registration
operatorRouter.post("/login", loginOperator); // Route for operator login

export default operatorRouter;