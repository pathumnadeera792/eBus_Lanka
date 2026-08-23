import express from "express";
import { createPassenger, loginPassenger } from "../controllers/passengerController.js";

const passengerRouter = express.Router();



passengerRouter.post("/register", createPassenger);
passengerRouter.post("/login", loginPassenger);


export default passengerRouter;