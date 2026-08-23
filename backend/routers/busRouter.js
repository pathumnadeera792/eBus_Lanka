import express from "express";
import { addBus, getOperatorBuses, updateBus, deleteBus } from "../controllers/busController.js";


const busRouter = express.Router();

busRouter.post("/add", addBus); // Add a bus
busRouter.get("/my-buses", getOperatorBuses); // Get operator's buses
busRouter.put("/update/:id", updateBus); // Edit a bus
busRouter.delete("/delete/:id", deleteBus); // Delete a bus

export default busRouter;