"use client";

import React, { useState, useEffect } from "react";
import { FiEdit3, FiTrash2, FiStar, FiLoader, FiMessageSquare, FiSend } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// 🟢 এপিআই মেথড সমূহ ইম্পোর্ট
import { getDeliveriesByEmail, getAllReviews } from "@/lib/api/books";
import { createBookReview, updateBookReview, deleteBookReview } from "@/lib/actions/books"; // 👈 সঠিক অ্যাকশন মেথড ইম্পোর্ট করা হলো ভাই

export default function MyReviews() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক স্টেট সমূহ
  const [deliveredReviews, setDeliveredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // কমেন্ট টেক্সট, ডাইনামিক রেটিং এবং সাবমিটিং লোডার ট্র্যাক করার স্টেট ভাই
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewRatings, setReviewRatings] = useState({}); 
  const [submittingId, setSubmittingId] = useState(null);

  // 📢 লাইট থিম নোটিফিকেশন ফাংশন ভাই
  const showNotification = (message, type = "success") => {
    const toastOptions = {
      style: {
        borderRadius: "9999px",
        background: "#ffffff",
        color: "#1f2937",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 16px",
      },
    };

    if (type === "success") {
      toast.success(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#10b981",
          secondary: "#ffffff",
        },
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#ef4444",
          secondary: "#ffffff",
        },
      });
    }
  };

  // 🔄 ডাটাবেজ থেকে ডেটা লোড করার কোর ফাংশন
  const loadDeliveredBooksAndReviews = async () => {
    if (sessionLoading) return;
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      const currentUserId = session.user.id || session.user._id;

      const deliveriesData = await getDeliveriesByEmail(session.user.email);
      const allReviewsData = await getAllReviews();
      
      if (Array.isArray(deliveriesData)) {
        const filteredDeliveries = deliveriesData.filter(
          (item) => 
            item.userEmail === session.user.email && 
            item.userId === currentUserId &&
            item.deliveryStatus === "Delivered"
        );

        filteredDeliveries.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

        const initialInputs = {};
        const initialRatings = {};

        const syncedDeliveries = filteredDeliveries.map((book) => {
          let matchedComment = "";
          let matchedRating = 5;
          let matchedReviewId = null;

          if (Array.isArray(allReviewsData)) {
            const userReview = allReviewsData.find(
              (rev) => rev.bookId === book.bookId && rev.userId === currentUserId
            );

            if (userReview) {
              matchedComment = userReview.comment || "";
              matchedRating = userReview.rating || 5;
              matchedReviewId = userReview._id;
            }
          }

          initialInputs[book._id] = ""; 
          initialRatings[book._id] = matchedRating; 

          return {
            ...book,
            reviewId: matchedReviewId, // 👈 ডাইনামিক রিভিউ আইডি পুশ
            comment: matchedComment,
            rating: matchedRating
          };
        });

        setDeliveredReviews(syncedDeliveries);
        setReviewInputs(prev => ({ ...initialInputs, ...prev }));
        setReviewRatings(prev => ({ ...initialRatings, ...prev }));
      }
    } catch (err) {
      console.error("Error cross-checking review pipeline registries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadDeliveredBooksAndReviews();
  }, [session?.user?.email, sessionLoading]);

  // কমেন্ট ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (id, val) => {
    setReviewInputs(prev => ({ ...prev, [id]: val }));
  };

  // ইউজারের লাইভ স্টার রেটিং ক্লিক হ্যান্ডলার ভাই
  const handleRatingChange = (id, ratingValue) => {
    setReviewRatings(prev => ({ ...prev, [id]: ratingValue }));
  };

  // 📝 এডিট আইকন ক্লিক করলে টেক্সট ইনপুট বক্সে ডাটা পাঠানোর লজিক ভাই
  const handleEditClick = (id, existingComment, existingRating) => {
    setReviewInputs(prev => ({ ...prev, [id]: existingComment }));
    setReviewRatings(prev => ({ ...prev, [id]: existingRating }));
    showNotification("✏️ Review loaded into input field for editing.", "success");
  };

  // 🗑️ রিভিউ ডিলিট করার হ্যান্ডলার ভাই (deleteBookReview মেথড ইমপ্লিমেন্ট করা হলো)
  const handleDeleteClick = async (id, reviewId, currentBookTitle) => {
    if (!reviewId) {
      showNotification("⚠️ You haven't reviewed this book yet!", "error");
      return;
    }

    if (!confirm(`⚠️ Are you sure you want to permanently delete your review for "${currentBookTitle}"?`)) return;

    try {
      setSubmittingId(id);
      const result = await deleteBookReview(reviewId); // 👈 আপনার সঠিক ডিলিট ফাংশন কল ভাই
      
      if (result.success) {
        showNotification(`🗑️ Review deleted successfully for "${currentBookTitle}"`, "success");
        // ডিলিট হওয়ার পর সংশ্লিষ্ট ইনপুট ফিল্ড ক্লিন করা
        setReviewInputs(prev => ({ ...prev, [id]: "" }));
        await loadDeliveredBooksAndReviews(); // ডাটা রি-লোডিং ভাই
      } else {
        showNotification(`❌ Failed: ${result.message || "Could not delete review."}`, "error");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      showNotification("❌ A network error occurred while deleting.", "error");
    } finally {
      setSubmittingId(null);
    }
  };

  // এপিআই কলসহ কমেন্ট সাবমিট/আপডেট করার হ্যান্ডলার (updateBookReview মেথড ইমপ্লিমেন্ট করা হলো)
  const handleSubmitComment = async (id, currentBookTitle) => {
    const commentText = reviewInputs[id]?.trim();
    if (!commentText) {
      showNotification("⚠️ Please write something before submitting your thoughts!", "error");
      return;
    }

    const currentItem = deliveredReviews.find(item => item._id === id);
    if (!currentItem) return;

    try {
      setSubmittingId(id);
      let result;

      // 🔄 যদি অলরেডি ডাটাবেজে রিভিউ থাকে, তবে সাবমিট বাটনটি updateBookReview হিসেবে কাজ করবে ভাই
      if (currentItem.reviewId) {
        result = await updateBookReview(currentItem.reviewId, { // 👈 আপনার সঠিক আপডেট ফাংশন কল ভাই
          comment: commentText,
          rating: reviewRatings[id] || 5
        });
      } else {
        // নতুন রিভিউ তৈরি মোড ভাই
        const reviewPayload = {
          bookId: currentItem.bookId,
          deliveryId: currentItem._id, 
          title: currentItem.title,
          author: currentItem.author,
          image: currentItem.image,
          category: currentItem.category,
          userId: currentItem.userId,
          userEmail: currentItem.userEmail,
          userName: currentItem.userName,
          comment: commentText,
          rating: reviewRatings[id] || 5 
        };
        result = await createBookReview(reviewPayload);
      }
      
      if (result.success) {
        // সফলভাবে সাবমিট বা আপডেট হওয়ার পর ইনপুট ফিল্ড ফাঁকা করা
        setReviewInputs(prev => ({ ...prev, [id]: "" }));
        showNotification(currentItem.reviewId ? `🎉 Review updated for "${currentBookTitle}"` : `🎉 Review stored for "${currentBookTitle}"`, "success");
        await loadDeliveredBooksAndReviews(); // ডাটা লাইভ রি-সিঙ্ক
      } else {
        showNotification(`❌ Failed: ${result.message || "Could not save review data."}`, "error");
      }
    } catch (err) {
      console.error("Failed to save commentary feedback via fetch:", err);
      showNotification("❌ A network error occurred while updating the database.", "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>LOADING REVIEWS AND COMMENTARIES...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center text-rose-400 font-bold text-xs">
        🔒 Access Denied. Valid login token payload required.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full relative">
      
      <Toaster position="top-right" reverseOrder={false} />

      {/* হেডার ব্লক */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Reviews & Comments</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Manage your thoughts and ratings given to items.</p>
      </motion.div>

      {deliveredReviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl py-14 text-center"
        >
          <div className="mx-auto w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <FiMessageSquare size={18} />
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">
            No completed book drops found to review. Your registry is empty!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {deliveredReviews.map((rev, index) => (
              <motion.div 
                key={rev._id} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
                whileHover={{ borderColor: "rgba(63, 63, 70, 0.8)" }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-150"
              >
                {/* কন্টেন্ট পার্ট */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-white text-sm capitalize">{rev.title}</h3>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-0.5 capitalize">by {rev.author}</p>
                  </div>

                  <div className="flex gap-1">
                    {/* 📝 এডিট বাটন - এক্সিস্টিং কমেন্ট থাকলে লোড হবে ভাই */}
                    <button 
                      disabled={!rev.comment}
                      onClick={() => handleEditClick(rev._id, rev.comment, rev.rating)}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiEdit3 size={13} />
                    </button>
                    {/* 🗑️ ডিলিট বাটন - এখানে সঠিক ক্লিক হ্যান্ডলার বসানো হয়েছে */}
                    <button 
                      disabled={submittingId === rev._id || !rev.reviewId}
                      onClick={() => handleDeleteClick(rev._id, rev.reviewId, rev.title)}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* হোয়াইট কমেন্ট ডিসপ্লে বক্স */}
                {rev.comment && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800 capitalize">
                        {rev.userName || session?.user?.name || "Farista Said"}
                      </p>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(index === -1 ? 5 : (Number(rev.rating) || 5))].map((_, idx) => (
                          <FiStar key={idx} size={13} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-black italic font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <p className="text-[9px] text-slate-700 font-medium text-right pt-1">
                      Reviewed on: {formatDate(rev.createdAt || rev.requestedAt)}
                    </p>
                  </motion.div>
                )}

                {/* ইনপুট এবং স্টার সিলেক্টর এরিয়া */}
                <div className="space-y-2 pt-1 border-t border-zinc-800/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      {rev.comment ? "Update Rating & Thought:" : "Give Your Rating & Thought:"}
                    </span>
                    
                    <div className="flex items-center gap-0.5 text-zinc-600 bg-zinc-950/40 px-2 py-1 rounded-lg border border-zinc-800/30">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const currentCardRating = reviewRatings[rev._id] || 5;
                        const isSelected = starValue <= currentCardRating;
                        
                        return (
                          <motion.button
                            key={starValue}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleRatingChange(rev._id, starValue)}
                            className={`transition-colors duration-150 outline-none ${
                              isSelected ? "text-amber-400" : "text-zinc-700 hover:text-zinc-500"
                            }`}
                          >
                            <FiStar size={12} fill={isSelected ? "currentColor" : "none"} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={reviewInputs[rev._id] || ""}
                      onChange={(e) => handleInputChange(rev._id, e.target.value)}
                      placeholder="Write or edit your book commentary here..."
                      className="flex-1 bg-zinc-950/60 text-zinc-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-zinc-800/50 outline-none focus:border-indigo-500/80 transition-all placeholder:text-zinc-600"
                    />
                    
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      disabled={submittingId === rev._id}
                      onClick={() => handleSubmitComment(rev._id, rev.title)}
                      className="bg-zinc-800 hover:bg-indigo-600 disabled:bg-zinc-850 text-zinc-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 flex-shrink-0 border border-zinc-750/40"
                    >
                      {submittingId === rev._id ? (
                        <FiLoader className="animate-spin text-indigo-400" size={14} />
                      ) : (
                        <>
                          <FiSend size={12} />
                          <span>Submit</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}