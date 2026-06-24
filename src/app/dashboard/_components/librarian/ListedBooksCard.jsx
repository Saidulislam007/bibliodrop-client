"use client";

import React, { useState, useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

// 🟢 আপনার এপিআই মেথড ইম্পোর্ট করা হলো ভাই
import { getBooks } from "@/lib/api/books"; 

export default function ListedBooksCard() {
  // ডাইনামিক স্টেট সমূহ
  const [totalBooks, setTotalBooks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalBooksCount = async () => {
      try {
        setLoading(true);
        // ১. এপিআই কল করে সমস্ত বইয়ের ডাটা এক টানে নিয়ে আসা হলো ভাই
        const data = await getBooks("", ""); 
        
        // ২. ডাটাবেজ রেসপন্স স্ট্রাকচার সেফলি হ্যান্ডেল করা হলো
        let fetchedBooks = Array.isArray(data) ? data : data?.books || [];
        
        // ৩. টোটাল বইয়ের লেংথ (length) স্টেট-এ সেট করা হলো ভাই
        setTotalBooks(fetchedBooks.length);
      } catch (err) {
        console.error("Error fetching library listed books count asset:", err);
        setTotalBooks(0); // ক্র্যাশ সেফটি ব্যাকআপ
      } finally {
        setLoading(false);
      }
    };

    fetchTotalBooksCount();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(63, 63, 70, 0.8)" }}
      className="bg-black border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors duration-200"
    >
      {/* আপনার নিজস্ব আইকন কন্টেইনার */}
      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
        <FiBookOpen size={20} />
      </div>
      
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Total Books Listed
        </p>
        
        {/* 🎯 আপনার পিওর UI অক্ষুণ্ণ রেখে ডাইনামিক লাইভ লেংথ ডাটা মেপিং ভাই */}
        <p className="text-xl font-black text-white mt-0.5">
          {loading ? (
            <span className="inline-block w-8 h-5 bg-zinc-800 rounded animate-pulse" />
          ) : (
            totalBooks
          )}
        </p>
      </div>
    </motion.div>
  );
}