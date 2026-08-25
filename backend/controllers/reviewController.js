import Review from "../models/review.js";

// 1. Get ONLY approved reviews for passengers page
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .populate("passengerId", "firstName lastName email")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

// 2. Get ALL reviews for Super Admin (to approve/disapprove)
export const getAllReviewsForAdmin = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate("passengerId", "firstName lastName email")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admin reviews", error: error.message });
    }
};

// 3. Add a new review (Default isApproved: false so admin must approve it)
export const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const passengerId = req.user.id; 

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        const newReview = new Review({
            passengerId,
            rating,
            comment,
            isApproved: false // Admin approve කරන තුරු false ලෙස තැබේ
        });

        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully! Waiting for admin approval.", review: newReview });
    } catch (error) {
        console.error("Review creation error:", error);
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};

// 4. Admin approval toggle / update
export const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { isApproved },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review status updated successfully", review: updatedReview });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review status", error: error.message });
    }
};

// 5. Delete review by admin
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
};