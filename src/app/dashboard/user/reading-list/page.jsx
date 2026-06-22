"use client";

import React, { useState, useEffect } from "react";
import { FiLoader, FiBookOpen, FiDollarSign, FiTruck, FiCalendar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 এপিআই মেথড ইম্পোর্ট
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function ReadingList() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক স্টেট সমূহ
  const [completedBooks, setCompletedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReadingList = async () => {
      if (sessionLoading) return;
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const currentUserId = session.user.id || session.user._id;

        const data = await getDeliveriesByEmail(session.user.email);
        
        if (Array.isArray(data)) {
          // সিকিউরিটি ও স্ট্যাটাস ফিল্টার
          const filteredBooks = data.filter(
            (item) => 
              item.userEmail === session.user.email && 
              item.userId === currentUserId && 
              item.deliveryStatus === "Delivered"
          );

          filteredBooks.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
          setCompletedBooks(filteredBooks);
        }
      } catch (err) {
        console.error("Error synchronizing library reading list repository:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReadingList();
  }, [session?.user?.email, sessionLoading]);

  // ডেট ফরম্যাট করার হেল্পার ফাংশন ভাই
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>SYNCHRONIZING READ BOOK REGISTRIES...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center text-rose-400 font-bold text-xs">
        🔒 Access Denied. Active session token validation required to view reading registry.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* হেডার ব্লক - অ্যানিমেশন সহ */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black text-white tracking-tight">My Reading List</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Books you have successfully received and finished devouring.</p>
      </motion.div>

      {completedBooks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl py-16 text-center"
        >
          <div className="mx-auto w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <FiBookOpen size={20} />
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">
            Your reading repository is empty. Complete a book drop delivery to add items here!
          </p>
        </motion.div>
      ) : (
        /* 📦 ডাইনামিক লাইভ ডাটা মোশন গ্রিড লেআউট ভাই */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {completedBooks.map((book, index) => (
              <motion.div 
                key={book._id} 
                // 🎬 কার্ড এন্ট্রান্স অ্যানিমেশন ওয়েভ (Stagger Effect) ভাই
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
                
                // ✨ কাস্টম প্রফেশনাল হোভার ইন্টারঅ্যাকশন
                whileHover={{ 
                  y: -5,
                  scale: 1.01,
                  borderColor: "rgba(63, 63, 70, 0.8)",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)"
                }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer transition-colors duration-200"
              >
                {/* বুক কভার ইমেজ সেকশন */}
                <div className="aspect-[3/4] w-full relative bg-zinc-950 overflow-hidden">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  />
                  
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm uppercase tracking-wide">
                    {book.category || "General"}
                  </span>
                  
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[8px] font-black rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800">
                    ✓ Finished
                  </span>
                </div>
                
                {/* 🟢 বইয়ের বিবরণী কার্ড বডি */}
                <div className="p-4 bg-zinc-900/90 border-t border-zinc-800/40 space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-white text-sm truncate capitalize group-hover:text-indigo-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate capitalize">
                      by {book.author || "Unknown Author"}
                    </p>
                  </div>

                  {/* 📊 মেটা ইনফরমেশন গ্রিড */}
                  <div className="pt-2 border-t border-zinc-800/60 space-y-1.5 text-[11px] text-zinc-400 font-medium">
                    {/* বইয়ের দাম */}
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={13} className="text-zinc-500" />
                      <span>Price: <span className="text-zinc-200 font-bold">${book.price || "0"}</span></span>
                    </div>

                    {/* ডেলিভারি ফি */}
                    <div className="flex items-center gap-2">
                      <FiTruck size={13} className="text-zinc-500" />
                      <span>Delivery Fee: <span className="text-amber-400 font-bold">${book.fee?.toFixed(2) || "0.00"}</span></span>
                    </div>

                    {/* রিকোয়েস্ট করার তারিখ */}
                    <div className="flex items-center gap-2">
                      <FiCalendar size={13} className="text-zinc-500" />
                      <span>Ordered: <span className="text-zinc-500 text-[10px]">{formatDate(book.requestedAt)}</span></span>
                    </div>
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