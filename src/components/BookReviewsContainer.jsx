"use client"; // 🟢 ফিক্সড: ক্লায়েন্ট ডিরেক্টিভ এখানে থাকবে ভাই

import React, { useState, useEffect } from "react";
import { FiStar, FiLoader } from "react-icons/fi";
import { getAllReviews } from "@/lib/api/books"; 

export default function BookReviewsContainer({ currentBookId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterReviews = async () => {
      try {
        setLoading(true);
        const data = await getAllReviews();
        if (Array.isArray(data)) {
          const matchedReviews = data.filter(
            (rev) => rev.bookId === currentBookId && rev.comment?.trim() !== ""
          );
          setReviews(matchedReviews);
        }
      } catch (err) {
        console.error("Error connecting to live review feeds:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentBookId) {
      fetchAndFilterReviews();
    }
  }, [currentBookId]);

  if (loading) {
    return (
      <div className="mt-12 w-full flex items-center justify-center p-8 text-slate-400 text-xs font-bold gap-2">
        <FiLoader className="animate-spin text-purple-600" size={16} />
        <span>LOADING LIVE VISITOR REVIEWS...</span>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Reviews ({reviews.length})</h2>
      <div className="bg-purple-50 border border-purple-100 text-purple-700 rounded-xl p-4 flex items-center gap-3 text-sm mb-6">
        <span>📦</span>
        <p>Only users who have received this book can leave a review.</p>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
          No commentary footprints left for this specific catalog asset yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">{rev.userName || "Anonymous Reader"}</p>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(Number(rev.rating) || 5)].map((_, idx) => (
                    <FiStar size={14} fill="currentColor" key={idx} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}