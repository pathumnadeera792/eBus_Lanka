import express from "express";
import { createPassenger } from "../controllers/passengerController.js";
import { loginPassenger } from "../controllers/passengerController.js";

const passengerRouter = express.Router();
passengerRouter.post("/", createPassenger);
passengerRouter.post("/login", loginPassenger);

export default passengerRouter;