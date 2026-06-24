"use client";

import React, { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

// 🟢 আপনার এপিআই মেথড ইম্পোর্ট করা হলো ভাই
import { getBooks } from "@/lib/api/books";

export default function PendingRequestsCard() {
  // ডাইনামিক স্টেট সমূহ
  const [pendingCount, setPendingCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingBooksCount = async () => {
      try {
        setLoading(true);
        // ১. এপিআই কল করে সমস্ত বইয়ের ডাটা নিয়ে আসা হলো ভাই
        const data = await getBooks("", "");
        
        let fetchedBooks = Array.isArray(data) ? data : data?.books || [];
        
        // 🎯 ২. [🧠 ফিল্টার লজিক] শুধুমাত্র "Pending Approval" স্ট্যাটাসের বইগুলো আলাদা করা হলো ভাই
        const pendingBooks = fetchedBooks.filter(
          (book) => book.status === "Pending Approval"
        );
        
        // ৩. ফিল্টার করা বইয়ের মোট সংখ্যা সেটিং
        setPendingCount(pendingBooks.length);
      } catch (error) {
        console.error("Error calculating pending approval assets:", error);
        setPendingCount(0); // ক্র্যাশ সেফটি ব্যাকআপ ভাই
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBooksCount();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(63, 63, 70, 0.8)" }}
      className="bg-black border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors duration-200"
    >
      {/* আপনার নিজস্ব আইকন কন্টেইনার */}
      <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
        <FiClock size={20} />
      </div>
      
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Pending Requests
        </p>
        
        {/* 🎯 আপনার পিওর UI অক্ষুণ্ণ রেখে ডাইনামিক লাইভ ফিল্টার ডাটা কাউন্টার ভাই */}
        <p className="text-xl font-black text-white mt-0.5">
          {loading ? (
            <span className="inline-block w-6 h-5 bg-zinc-800 rounded animate-pulse" />
          ) : (
            pendingCount
          )}
        </p>
      </div>
    </motion.div>
  );
}