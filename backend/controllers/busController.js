import Bus from "../models/bus.js";

// 1. Add a new Bus
export const addBus = async (req, res) => {
    try {
        const busData = req.body;
        
        // Token atach
        if(req.user && req.user.id) {
            busData.operatorId = req.user.id;
        }

        const newBus = new Bus(busData);
        await newBus.save();
        
        res.status(201).json({ message: "Bus added successfully. Waiting for admin approval.", bus: newBus });
    } catch (error) {
        res.status(500).json({ message: "Failed to add bus", error: error.message });
    }
};



// 2. Get all buses for a specific operator (My Buses page)
export const getOperatorBuses = async (req, res) => {
    try {
        // Token check
        const operatorId = req.user.id; 
        const buses = await Bus.find({ operatorId: operatorId });
        
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch buses", error: error.message });
    }
};



// 3. Update a Bus
export const updateBus = async (req, res) => {
    try {
        const busId = req.params.id;
        const updatedData = req.body;
        
        const bus = await Bus.findByIdAndUpdate(busId, updatedData, { new: true });
        
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        
        res.status(200).json({ message: "Bus updated successfully", bus });
    } catch (error) {
        res.status(500).json({ message: "Failed to update bus", error: error.message });
    }
};



// 4. Delete a Bus
export const deleteBus = async (req, res) => {
    try {
        const busId = req.params.id;
        
        const bus = await Bus.findByIdAndDelete(busId);
        
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        
        res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete bus", error: error.message });
    }
};