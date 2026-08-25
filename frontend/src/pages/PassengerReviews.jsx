import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaPlus, FaTimes } from "react-icons/fa";

export default function PassengerReviews() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State and Form Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews on page load
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/reviews/all`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [backendUrl]);

  // Handle Add Review Submit
  const handleAddReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting review...");

    try {
      await axios.post(
        `${backendUrl}/api/reviews/add`,
        { rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added successfully!", { id: toastId });
      setIsModalOpen(false);
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh review list
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error(error.response?.data?.message || "Failed to add review", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render stars based on rating number
  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar 
        key={index} 
        className={`inline-block text-sm ${index < count ? "text-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[35vh] bg-cover bg-center flex items-center justify-center shadow-md"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Passenger Reviews & Feedback
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition inline-flex items-center gap-2 text-sm"
          >
            <FaPlus /> Add Review
          </button>
        </div>
      </div>

      {/* Reviews Table Section */}
      <div className="max-w-6xl mx-auto w-full px-6 py-16 flex-grow">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-700 text-white font-bold text-sm uppercase tracking-wider">
                  <th className="p-4 text-center">#</th>
                  <th className="p-4">Passenger Name</th>
                  <th className="p-4 text-center">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading reviews...</td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No reviews found yet. Be the first to review!</td>
                  </tr>
                ) : (
                  reviews.map((rev, index) => (
                    <tr key={rev._id} className="hover:bg-green-50/50 transition">
                      <td className="p-4 text-center font-bold text-gray-500">{index + 1}</td>
                      <td className="p-4 font-semibold text-gray-900">
                       {rev.passengerId ? `${rev.passengerId.firstName || ""} ${rev.passengerId.lastName || ""}`.trim() || rev.passengerId.email : "Anonymous Passenger"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-0.5">
                          {renderStars(rev.rating)}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 italic max-w-md truncate">
                        "{rev.comment}"
                      </td>
                      <td className="p-4 text-center text-gray-500 text-xs">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD REVIEW MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative border border-gray-200">
            
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl font-bold"
            >
              <FaTimes />
            </button>

            <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-6">Write a Review</h3>

            <form onSubmit={handleAddReview} className="space-y-5">
              
              {/* Rating selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-gray-800 text-lg">{rating} / 5</span>
                </div>
              </div>

              {/* Comment text area */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Feedback / Comment</label>
                <textarea 
                  rows="4"
                  placeholder="Share your experience with eBus Lanka..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-800 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 space-y-3">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-center"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition text-center"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}