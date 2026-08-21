import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'passengers', required: true },
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'buses' }, // one review can be associated with a bus
        rating: { type: Number, required: true, min: 1, max: 5 }, // 1 to 5 star rating
        comment: { type: String, required: true },
        isApproved: { type: Boolean, default: true } // admin can approve or disapprove the review
    },
    { timestamps: true }
);

const Review = mongoose.model("reviews", reviewSchema);

export default Review;