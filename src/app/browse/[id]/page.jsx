"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiTruck, FiEdit2, FiEyeOff, FiTrash2, FiStar, FiLogIn, FiHeart } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api/books"; 
import { addToWishlist, deleteBook, requestBookDelivery } from "@/lib/actions/books";
import BookReviewsContainer from "@/components/BookReviewsContainer";

export default function BookDetailsPage({ params }) {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // স্টেট লজিকস
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false); 

  // মক রিভিউ ডেটা
  const dummyReviews = [
    { id: 1, user: "Ziaan Islam", rating: 5, comment: "Absolutely marvelous scientific briefing. Highly tracking asset!" },
    { id: 2, user: "Md. Saidul", rating: 4, comment: "Clean concept wrapper. The description matches the theme perfectly." }
  ];

  useEffect(() => {
    const fetchSingleBook = async () => {
      try {
        setLoading(true);
        const data = await getBooks("", "");
        const allBooks = Array.isArray(data) ? data : data?.books || [];
        const currentBook = allBooks.find(b => b._id === id);
        setBook(currentBook);
      } catch (err) {
        console.error("Error reading book asset details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSingleBook();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("⚠️ Proceed with caution. Are you sure you want to delete this library asset permanently?")) return;
    try {
      setActionLoading(true);
      await deleteBook(book._id);
      alert("🗑️ Asset successfully deleted.");
      router.push("/browse");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🚚 💳 ডাইনামিক ডেলিভারি রিকোয়েস্ট ও প্রসেসিং হ্যান্ডলার ভাই
  const handleDeliveryRequest = async () => {
    if (!session?.user) {
      alert("🔒 Authentication required! Please log in to request home delivery.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    // ✅ সমাধান ১: ডাটাবেজ পেলোড অবজেক্টে 'price' প্রোপার্টি নিশ্চিতভাবে পাঠানো হচ্ছে ভাই
    const deliveryPayload = {
      bookId: book._id,
      title: book.title,
      author: book.author,
      image: book.image,
      category: book.category,
      fee: book.fee,
      price: book.price || (book.fee ? book.fee * 100 : 0), // ডাটাবেজে প্রাইস মিসিং থাকলে ব্যাকআপ ক্যালকুলেশন ভ্যালু যাবে
      librarianId: book.librarianId,
      librarianEmail: book.librarianEmail,
      // 👤 কারেন্ট লগইন থাকা ইউজারের ইনফরমেশন (Better-Auth)
      userId: session.user.id || session.user._id,
      userEmail: session.user.email,
      userName: session.user.name,
      deliveryStatus: "Pending", // শুরুর স্ট্যাটাস ডিফল্ট পেন্ডিং থাকবে
      requestedAt: new Date().toISOString()
    };

    try {
      // 🟢 আপনার এপিআই মেথড কল করে ব্যাকএন্ডে হিট করা হলো ভাই
      const result = await requestBookDelivery(deliveryPayload);

      if (result.success || result.insertedId) {
        alert(`🎉 Success! Home delivery request for "${book.title}" has been placed securely.`);
      } else {
        alert(`❌ Failed: ${result.message || "Could not process delivery configuration."}`);
      }
    } catch (err) {
      console.error("Delivery request component crash:", err);
      alert("❌ A network error occurred while placing the delivery request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 💖 উইশলিস্ট টগল হ্যান্ডলার
  const handleWishlistToggle = async () => {
    if (!session?.user) {
      alert("🔒 Authentication required! Please log in to your account to add a book to your wishlist.");
      router.push("/login");
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
      price: book.price || (book.fee ? book.fee * 100 : 0), // উইশলিস্টেও সেফটি চেক রাখা হলো ভাই
      userId: session.user.id || session.user._id,
      userEmail: session.user.email,
      addedAt: new Date().toISOString()
    };

    try {
      const result = await addToWishlist(wishlistData);

      if (result.success || result.insertedId) {
        setIsInWishlist(!isInWishlist);
        alert("❤️ Added to your wishlist successfully!");
      } else {
        alert(`❌ Failed: ${result.message || "Could not sync wishlist node asset."}`);
      }
    } catch (err) {
      console.error("Wishlist toggle component crash:", err);
      alert("❌ A network error occurred while updating wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-xs font-bold tracking-wider animate-pulse">SYNCHRONIZING ASSET COMPONENT...</div>;
  if (!book) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-rose-500 text-xs font-bold">❌ 404: BOOK CATALOG NOT FOUND IN CORE DATABASE.</div>;

  const isLibrarianOwner = session?.user?.email === book.librarianEmail;
  const isOutOfStock = (book.stockQuantity || 0) < 1;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Back Button */}
      <button 
        onClick={() => router.push("/browse")} 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition font-medium"
      >
        <FiArrowLeft /> Back to Catalog Exploration
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Left Side: Book Image */}
        <div className="relative flex justify-center items-start">
          <img 
            src={book.image} 
            alt={book.title} 
            className="w-full max-w-sm h-[450px] object-cover rounded-2xl shadow-md border border-gray-100"
          />
          <span className="absolute top-4 right-8 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
            {book.status || (isOutOfStock ? "Out of Stock" : "Available")}
          </span>
        </div>

        {/* Right Side: Book Information */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-purple-600 font-medium text-sm tracking-wide bg-purple-50 px-3 py-1 rounded-md w-fit mb-4 inline-block uppercase">
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
                <span className="text-slate-800 font-bold">${book.fee?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">👤 Listed by:</span>
                <span className="text-slate-700 font-medium">{book.librarianEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📅 Added:</span>
                <span className="text-slate-700 font-medium">{formatDate(book.dateAdded || book.publishedAt)}</span>
              </div>
              
              {/* ✅ সমাধান ২: UI লেভেলে ডাইনামিক ফলব্যাক মেকানিজম সেট করা হলো ভাই */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">💰 Book Price:</span>
                <span className="text-slate-800 font-semibold">
                  ${book.price ? book.price : book.fee ? (book.fee * 100).toFixed(0) : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-auto">
            {!session?.user ? (
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => router.push("/login")} 
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 flex justify-center items-center gap-2"
                >
                  <FiLogIn size={16} /> Please Login to Order
                </button>
                <button 
                  onClick={handleWishlistToggle} 
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition flex justify-center items-center gap-2"
                >
                  <FiHeart size={16} /> Add to Wishlist
                </button>
              </div>
            ) : isLibrarianOwner ? (
              <div className="flex gap-3 w-full">
                <button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition flex justify-center items-center gap-2">
                  <FiEdit2 size={16}/> Edit Asset
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2">
                  <FiEyeOff size={16}/> Unpublish
                </button>
                <button 
                  onClick={handleDelete} 
                  disabled={actionLoading} 
                  className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition border border-rose-200"
                >
                  <FiTrash2 size={18}/>
                </button>
              </div>
            ) : (
              <div className="flex gap-4 w-full">
                <button 
                  onClick={handleDeliveryRequest}
                  disabled={isOutOfStock || isProcessing}
                  className={`flex-1 min-w-[150px] font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 flex justify-center items-center gap-2 text-white ${
                    isOutOfStock 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                      : isProcessing
                      ? "bg-amber-500 cursor-wait animate-pulse shadow-md" 
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  <FiTruck size={16} /> 
                  {isOutOfStock ? "Unavailable" : isProcessing ? "Processing..." : "Request Home Delivery"}
                </button>

                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`flex-1 min-w-[150px] border font-semibold py-3 px-6 rounded-xl transition duration-200 flex justify-center items-center gap-2 disabled:opacity-50 ${
                    isInWishlist 
                      ? "bg-rose-50 border-rose-200 text-rose-600" 
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <FiHeart 
                    size={16} 
                    className={isInWishlist ? "fill-rose-600 text-rose-600" : "text-gray-700"} 
                  /> 
                  {wishlistLoading ? "Processing..." : isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <BookReviewsContainer currentBookId={id} />

    </div>
  );
}