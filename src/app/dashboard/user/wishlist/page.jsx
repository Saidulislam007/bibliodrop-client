"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiLoader, FiTruck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 এপিআই ও অ্যাকশন ইম্পোর্ট
import { getWishlistByEmail } from "@/lib/api/books";
import { deleteWishlistItem } from "@/lib/actions/books";

export default function WishlistPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক স্টেট সমূহ
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!sessionLoading && !session?.user) {
        setLoading(false);
        return;
      }

      if (session?.user?.email) {
        try {
          setLoading(true);
          const data = await getWishlistByEmail(session.user.email);
          
          const currentUserId = session.user.id || session.user._id;
          const filteredData = Array.isArray(data) ? data.filter(
            (item) => item.userEmail === session.user.email && item.userId === currentUserId
          ) : [];

          setWishlistBooks(filteredData);
        } catch (err) {
          console.error("Error loading wishlist assets:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadWishlist();
  }, [session, sessionLoading]);

  // 🚚 হোম ডেলিভারি রিকোয়েস্ট হ্যান্ডলার
  const handleRequestDelivery = async (book) => {
    if (!session?.user) {
      alert("🔒 Authentication token expired! Please log in again.");
      router.push("/login");
      return;
    }

    setProcessingId(book._id);

    const deliveryPayload = {
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      image: book.image,
      category: book.category,
      fee: book.fee,
      price: book.price,
      librarianId: book.librarianId,
      librarianEmail: book.librarianEmail,
      userId: session.user.id || session.user._id,
      userEmail: session.user.email,
      userName: session.user.name,
      deliveryStatus: "Pending",
      requestedAt: new Date().toISOString()
    };

    try {
      // এখানে আপনার ডেলিভারি রিকোয়েস্ট মেথড এপিআই কল হবে ভাই ভাই
      // const result = await createDeliveryRequest(deliveryPayload);
      const result = { success: true }; // ডামি সাকসেস ট্র্যাকার ভাই

      if (result.success || result.insertedId) {
        alert(`🎉 Success! Home delivery request for "${book.title}" placed successfully.`);
        
        // ইচ্ছা করলে উইশলিস্ট থেকে অর্ডার হয়ে গেলে নিচের ২ লাইন আনকমেন্ট করতে পারেন ভাই:
        // await deleteWishlistItem(book._id);
        // setWishlistBooks(prev => prev.filter(item => item._id !== book._id));
      } else {
        alert(`❌ Failed: ${result.message || "Could not complete delivery configuration."}`);
      }
    } catch (err) {
      console.error("Delivery processing crash:", err);
      alert("❌ A network error occurred while processing your delivery order.");
    } finally {
      setProcessingId(null);
    }
  };

  // 🗑️ ডাইনামিক ডিলিট হ্যান্ডলার
  const handleRemoveWish = async (wishId) => {
    if (!confirm("⚠️ Are you sure you want to remove this book from your wishlist permanently?")) return;
    
    try {
      const response = await deleteWishlistItem(wishId);
      
      if (response.success) {
        setWishlistBooks((prevBooks) => prevBooks.filter(book => book._id !== wishId));
        alert("💔 Item successfully removed from your wishlist.");
      } else {
        alert(`❌ Failed to remove: ${response.message || "Unknown backend error."}`);
      }
    } catch (err) {
      console.error("Wishlist deletion trigger crash:", err);
      alert("❌ A network error occurred while updating the database.");
    }
  };

  // ১. লোডিং অবস্থা
  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>SYNCHRONIZING WISHLIST MESH NODE...</span>
      </div>
    );
  }

  // ২. ইউজার লগইন প্রোটেকশন
  if (!session?.user) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl max-w-xl mx-auto mt-10">
        <p className="text-sm font-bold text-rose-400">🔒 Access Denied. Authentication Token Required.</p>
        <button onClick={() => router.push("/login")} className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
          Go to Login Panel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4">
      {/* হেডার সেকশন অ্যানিমেশন */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black text-white tracking-tight">My Wishlist</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Books you've saved for later.</p>
      </motion.div>

      {/* ৩. উইশলিস্ট খালি থাকলে এম্পটি স্টেট */}
      {wishlistBooks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl py-12 text-center"
        >
          <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">
            Your wishlist pipeline is empty. No saved catalog assets found.
          </p>
        </motion.div>
      ) : (
        /* ৪. রেসপনসিভ মোশন কার্ড গ্রিড লেআউট ভাই */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistBooks.map((book, index) => (
              <motion.div 
                key={book._id} 
                // 🎬 কার্ড এন্ট্রান্স অ্যানিমেশন ওয়েভ (Stagger Effect) ভাই
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
                
                // ✨ প্রিমিয়াম হোভার ইফেক্ট
                whileHover={{ 
                  y: -4,
                  scale: 1.01,
                  borderColor: "rgba(63, 63, 70, 0.8)",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)"
                }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group cursor-pointer transition-colors duration-200"
              >
                
                {/* বুক ইমেজ কন্টেইনার */}
                <div className="aspect-[4/3.5] w-full relative bg-zinc-950 p-2 flex items-center justify-center overflow-hidden">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/20 text-[#818cf8] text-[9px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-sm">
                    {book.category}
                  </span>
                </div>

                {/* কার্ড বডি মেটাডেটা */}
                <div className="p-4 space-y-4 bg-zinc-900 flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5 text-left">
                    <h3 className="font-bold text-white text-sm truncate capitalize group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                    <p className="text-xs text-zinc-500 truncate font-medium capitalize">{book.author}</p>
                  </div>

                  {/* প্রাইসিং ও অ্যাকশন কন্ট্রোল বাটন গ্রুপ */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500 font-extrabold text-sm">
                        ${book.fee?.toFixed(2) || "0.00"}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {/* ভিউ ডিটেইলস বাটন */}
                        <button 
                          onClick={() => router.push(`/browse/${book.bookId}`)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all"
                        >
                          View
                        </button>
                        
                        {/* উইশলিস্ট ডিলিট বাটন */}
                        <button 
                          onClick={() => handleRemoveWish(book._id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-all" 
                          title="Remove from wishlist"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* 🟢 মোশন এনিমেশন যুক্ত রিকোয়েস্ট হোম ডেলিভারি বাটন ভাই */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      disabled={processingId === book._id}
                      onClick={() => handleRequestDelivery(book)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
                    >
                      {processingId === book._id ? (
                        <>
                          <FiLoader className="animate-spin" size={14} />
                          <span>PROCESSING ROCKET...</span>
                        </>
                      ) : (
                        <>
                          <FiTruck size={14} />
                          <span>Request Home Delivery</span>
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