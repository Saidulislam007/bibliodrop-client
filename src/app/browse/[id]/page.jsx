"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft, FiTruck, FiEdit2, FiEyeOff, FiTrash2,
  FiHeart, FiCheckCircle, FiX, FiArrowRight, FiAlertCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api/books";
import { addToWishlist, deleteBook, requestBookDelivery, updateBookStatus } from "@/lib/actions/books";
import BookReviewsContainer from "@/components/BookReviewsContainer";
import Loader from "@/components/Loder";

export default function BookDetailsPage({ params }) {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const userRole = session?.user?.role || session?.user?.metadata?.role || "user";

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [hasRequestedDelivery, setHasRequestedDelivery] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: "History",
    price: "",
    description: ""
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const fetchSingleBook = async () => {
      try {
        setLoading(true);
        const data = await getBooks("", "");
        const allBooks = Array.isArray(data) ? data : data?.books || [];
        const currentBook = allBooks.find(b => b._id === id);
        setBook(currentBook);

        const currentUserId = session?.user?.id || session?.user?._id;
        const currentUserEmail = session?.user?.email;

        if (currentBook && (currentUserId || currentUserEmail)) {
          if (currentBook.requestedBy?.includes(currentUserId)) {
            setHasRequestedDelivery(true);
          }
          else if (currentBook.requestedEmails?.includes(currentUserEmail)) {
            setHasRequestedDelivery(true);
          }
          else if (currentBook.deliveryRequests?.some(req => req.userId === currentUserId || req.userEmail === currentUserEmail)) {
            setHasRequestedDelivery(true);
          }
        }
      } catch (err) {
        console.error("Error reading book asset details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSingleBook();
  }, [id, session]);

  const handleDelete = async () => {
    if (!confirm("⚠️ Proceed with caution. Are you sure you want to delete this library asset permanently?")) return;
    try {
      setActionLoading(true);
      await deleteBook(book._id);
      showNotification("🗑️ Asset successfully deleted.", "success");
      setTimeout(() => router.push("/browse"), 1200);
    } catch (err) {
      console.error(err);
      showNotification("❌ A network error occurred while deleting the book.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublishStatus = async () => {
    if (!book?._id) return;
    const nextStatus = book.status === "Published" ? "Pending Approval" : "Published";

    try {
      setActionLoading(true);
      const result = await updateBookStatus(book._id, { status: nextStatus });
      if (result?.success || result?.modifiedCount > 0 || result?.acknowledged === true) {
        setBook(prev => ({ ...prev, status: nextStatus }));
        showNotification(`🎉 Success! Book status changed to "${nextStatus}".`, "success");
      } else {
        showNotification(`❌ Failed: ${result?.message || "Could not change status registry."}`, "error");
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      showNotification("❌ An error occurred during status modification.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = () => {
    if (isInlineEditing) {
      setIsInlineEditing(false);
      return;
    }
    setEditFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "History",
      price: book.price !== undefined && book.price !== null ? book.price.toString() : "",
      description: book.description || ""
    });
    setIsInlineEditing(true);
  };

  const handleInlineUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const updatedPayload = {
        title: editFormData.title.trim(),
        author: editFormData.author.trim(),
        category: editFormData.category,
        price: parseFloat(editFormData.price) || 0,
        description: editFormData.description.trim()
      };
      const result = await updateBookStatus(book._id, updatedPayload);
      if (result?.success || result?.modifiedCount > 0 || result?.matchedCount > 0 || result?.acknowledged === true) {
        setBook(prev => ({ ...prev, ...updatedPayload }));
        showNotification("🎉 Success! Book assets updated in database.", "success");
        setIsInlineEditing(false);
      }
    } catch (error) {
      console.error(error);
      showNotification("❌ Cloud database sync failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeliveryModal = () => {
    if (!session?.user) {
      showNotification("🔒 Authentication required! Please log in.", "error");
      setTimeout(() => router.push("/login"), 1200);
      return;
    }

    if (isSuccessModalOpen) {
      setIsSuccessModalOpen(false);
      return;
    }

    setOrderSummary({
      transactionId: `6a395ffd5aa9ea75a7c2b610`,
      title: book.title,
      fee: book.fee ?? 4.50,
      price: book.price ?? 300,
      userName: session.user.name,
      userEmail: session.user.email
    });
    setIsSuccessModalOpen(true);
  };

  const handleDeliveryRequest = async () => {
    setIsProcessing(true);

    const deliveryPayload = {
      bookId: book._id,
      title: book.title,
      author: book.author,
      image: book.image,
      category: book.category,
      fee: orderSummary.fee,
      price: orderSummary.price,
      transactionId: orderSummary.transactionId, // 👈 ডাটাবেজে ট্রানজেকশন আইডি সেট করার মূল প্রোপার্টি
      librarianId: book.librarianId,
      librarianEmail: book.librarianEmail,
      userId: session.user.id || session.user._id,
      userEmail: session.user.email,
      userName: session.user.name,
      deliveryStatus: "Pending",
      requestedAt: new Date().toISOString()
    };

    try {
      const result = await requestBookDelivery(deliveryPayload);

      if (result.success || result.insertedId) {
        showNotification("🎉 Home Delivery Requested Successfully!", "success");
        setIsSuccessModalOpen(false);
        setHasRequestedDelivery(true);
      } else {
        showNotification(`❌ Failed: ${result.message || "Could not process delivery."}`, "error");
      }
    } catch (err) {
      console.error("Delivery request crash:", err);
      showNotification("❌ A network error occurred.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!session?.user) {
      showNotification("🔒 Authentication required! Please log in.", "error");
      setTimeout(() => router.push("/login"), 1200);
      return;
    }

    setWishlistLoading(true);

    const wishlistData = {
      bookId: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      fee: book.fee,
      image: book.image,
      status: book.status,
      librarianId: book.librarianId,
      librarianEmail: book.librarianEmail,
      price: book.price || (book.fee ? book.fee * 100 : 0),
      userId: session.user.id || session.user._id,
      userEmail: session.user.email,
      addedAt: new Date().toISOString()
    };

    try {
      const result = await addToWishlist(wishlistData);

      if (result.success || result.insertedId) {
        setIsInWishlist(!isInWishlist);
        showNotification("❤️ Added to your wishlist successfully!", "success");
      } else {
        showNotification(`❌ Failed: ${result.message || "Could not sync wishlist."}`, "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("❌ Wishlist mesh error.", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!book) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-rose-500 text-xs font-bold">❌ 404: BOOK CATALOG NOT FOUND IN CORE DATABASE.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-gray-800 relative">

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed top-5 left-0 right-0 mx-auto z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-xs tracking-wide w-fit max-w-[90%] sm:max-w-md border backdrop-blur-md ${toast.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-rose-50/90 border-rose-200 text-rose-800"
              }`}
          >
            {toast.type === "success" ? <FiCheckCircle className="text-emerald-600" size={16} /> : <FiAlertCircle className="text-rose-600" size={16} />}
            <span>{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: "", type: "success" })} className="ml-2 p-0.5 hover:bg-black/5 rounded-md text-slate-400 hover:text-slate-700 transition-colors">
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => router.push("/browse")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition font-medium"
      >
        <FiArrowLeft /> Back to Catalog Exploration
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        <div className="relative flex justify-center items-start">
          <img
            src={book.image}
            alt={book.title}
            className="w-full max-w-sm h-[450px] object-cover rounded-2xl shadow-md border border-gray-100"
          />
          <span className={`absolute top-4 right-8 text-xs font-semibold px-3 py-1 rounded-full border ${book.status === "Published"
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-amber-100 text-amber-700 border-amber-200"
            }`}>
            {book.status || "Pending Approval"}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-purple-600 font-medium text-sm tracking-wide bg-purple-50 px-3 py-1 rounded-md w-fit inline-block uppercase">
              {book.category}
            </span>

            <h1 className="text-4xl font-bold text-slate-900 capitalize mb-2">{book.title}</h1>
            <p className="text-gray-500 font-medium mb-6">
              by <span className="text-slate-700 font-semibold capitalize">{book.author}</span>
            </p>

            <p className="text-gray-600 leading-relaxed mb-8 capitalize text-justify">
              {book.description}
            </p>

            <div className="space-y-4 mb-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-semibold">💲 Delivery Fee:</span>
                <span className="text-slate-800 font-bold">${book.fee?.toFixed(2) || "4.50"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">👤 Listed by:</span>
                <span className="text-slate-700 font-medium">{book.librarianEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📅 Added:</span>
                <span className="text-slate-700 font-medium">{formatDate(book.dateAdded || book.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">💰 Book Price:</span>
                <span className="text-slate-800 font-semibold">
                  ${book.price ? book.price : "300"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto pt-4">
            {session?.user && (userRole === "librarian" || userRole === "admin") ? (
              <div className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 text-left shadow-inner">
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Librarian Controls</span>
                <div className="flex gap-2.5 w-full">
                  <button onClick={handleEditClick} className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex justify-center items-center gap-2 border ${isInlineEditing ? "bg-indigo-600 border-indigo-700 text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                    <FiEdit2 className={isInlineEditing ? "text-white" : "text-indigo-500"} size={13} /> {isInlineEditing ? "Close Panel" : "Edit"}
                  </button>
                  <button onClick={handleTogglePublishStatus} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex justify-center items-center gap-2">
                    <FiEyeOff className={book.status === "Published" ? "text-amber-500" : "text-emerald-500"} size={13} /> {book.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={handleDelete} disabled={actionLoading} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2.5 px-4 border border-rose-200 rounded-xl transition flex justify-center items-center gap-2">
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>

                {isInlineEditing && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-md text-xs animate-in fade-in duration-200">
                    <form onSubmit={handleInlineUpdateSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book Title</label>
                        <input type="text" required value={editFormData.title} onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Author Name</label>
                        <input type="text" required value={editFormData.author} onChange={e => setEditFormData({ ...editFormData, author: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                          <select value={editFormData.category} onChange={e => setEditFormData({ ...editFormData, category: e.target.value })} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
                            <option value="History">History</option>
                            <option value="Romance">Romance</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Academic">Academic</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book Price ($)</label>
                          <input type="number" step="0.01" required value={editFormData.price} onChange={e => setEditFormData({ ...editFormData, price: e.target.value })} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                        <textarea rows="3" required value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium resize-none" />
                      </div>
                      <div className="flex gap-2 pt-1.5">
                        <button type="button" onClick={() => setIsInlineEditing(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg">Cancel</button>
                        <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">Save</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full space-y-4">

                {isSuccessModalOpen && orderSummary && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200 text-center relative mb-2">

                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <FiCheckCircle className="stroke-[2]" size={18} />
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Payment Confirmation</h3>
                      </div>
                      <button
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="p-1 bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-100 transition-all"
                      >
                        <FiX size={13} />
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200/50 space-y-2.5 text-[11px]">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider">Asset Selected</span>
                        <span className="font-extrabold text-slate-800 truncate max-w-[170px] capitalize">{orderSummary.title}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider">Customer Name</span>
                        <span className="font-extrabold text-slate-700 capitalize">{orderSummary.userName}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider">Transaction Registry</span>
                        <span className="font-mono font-bold text-indigo-600 tracking-tight">{orderSummary.transactionId}</span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="font-bold text-slate-400 uppercase tracking-wider">Total Debited Amount</span>
                        <span className="text-base font-black text-emerald-600">${(Number(orderSummary.price) + Number(orderSummary.fee)).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        disabled={isProcessing}
                        onClick={handleDeliveryRequest}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-black font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span>{isProcessing ? "Processing..." : "Confirm & Pay"}</span>
                        <FiArrowRight size={14} />
                      </button>

                      <button
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold text-xs rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                )}

                <div className="flex gap-4 w-full">
                  {session?.user ? (
                    hasRequestedDelivery ? (
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-xl shadow-sm bg-amber-500 text-white flex justify-center items-center gap-2 border border-amber-600 pointer-events-none"
                      >
                        <FiCheckCircle className="text-white" size={16} /> Already Requested
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenDeliveryModal}
                        className={`flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 flex justify-center items-center gap-2 text-white ${isSuccessModalOpen ? "bg-slate-800 hover:bg-slate-900" : "bg-amber-500 hover:bg-amber-600"}`}
                      >
                        <FiTruck size={16} /> {isSuccessModalOpen ? "Close Payment Panel" : "Request Home Delivery"}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => router.push("/login")}
                      className="flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 flex justify-center items-center gap-2 text-white bg-[#6366f1] hover:bg-[#4f46e5]"
                    >
                      Login to Request Delivery
                    </button>
                  )}

                  <button onClick={handleWishlistToggle} className="flex-1 min-w-[150px] border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition flex justify-center items-center gap-2">
                    <FiHeart className={isInWishlist ? "fill-rose-600 text-rose-600" : "text-gray-700"} size={16} /> {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      <BookReviewsContainer currentBookId={id} />

    </div>
  );
}