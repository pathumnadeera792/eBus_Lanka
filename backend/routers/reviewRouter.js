import express from "express";
import jwt from "jsonwebtoken";
import { 
    getAllReviews, 
    getAllReviewsForAdmin, 
    createReview, 
    updateReviewStatus, 
    deleteReview 
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

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

reviewRouter.get("/all", getAllReviews);
reviewRouter.get("/admin/all", verifyToken, getAllReviewsForAdmin);
reviewRouter.post("/add", verifyToken, createReview);
reviewRouter.put("/admin/status/:id", verifyToken, updateReviewStatus);
reviewRouter.delete("/admin/:id", verifyToken, deleteReview);

export default reviewRouter;