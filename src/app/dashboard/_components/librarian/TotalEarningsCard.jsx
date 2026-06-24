"use client";

import React, { useState, useEffect } from "react";
import { FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

// 🟢 এপিআই অ্যাকশন ইম্পোর্ট ভাই
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function TotalEarningsCard() {
  // ডাইনামিক ডাটা ও লোডার স্টেট
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSumGlobalEarnings = async () => {
      try {
        setLoading(true);
        
        // ১. কুয়েরি প্যারামিটার ফাঁকা ("") রেখে কল করায় এক্সপ্রেস ব্যাকএন্ড সব ডেলিভারি ডাটা একসাথে রিটার্ন করবে ভাই
        const data = await getDeliveriesByEmail("");
        
        if (Array.isArray(data)) {
          // 🎯 ২. [🧠 স্ট্রং লজিক] শুধুমাত্র "deliveryStatus": "Delivered" ম্যাচ করা আইটেমগুলোর "price" (যেমন: 450) যোগ করা হলো
          const totalCalculatedRevenue = data
            .filter((item) => item.deliveryStatus === "Delivered")
            .reduce((sum, item) => sum + (Number(item.price) || 0), 0);
          
          setEarnings(totalCalculatedRevenue);
        } else {
          setEarnings(0);
        }
      } catch (error) {
        console.error("Failed to run global pipeline summation for earnings card:", error);
        setEarnings(0); // ক্র্যাশ সেফটি ব্যাকআপ ভাই
      } finally {
        setLoading(false);
      }
    };

    fetchAndSumGlobalEarnings();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
      whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(63, 63, 70, 0.8)" }}
      className="bg-black border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors duration-200"
    >
      {/* আপনার নিজস্ব আইকন কন্টেইনার */}
      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
        <FiDollarSign size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
        
        {/* 🚀 আপনার পিওর UI থিম ও কালার টোন অপরিবর্তিত রেখে ডাইনামিক ডাটা রেন্ডারিং ভাই */}
        <p className="text-xl font-black text-white mt-0.5">
          {loading ? (
            <span className="inline-block w-12 h-5 bg-zinc-800 rounded animate-pulse" />
          ) : (
            `$${Number(earnings).toFixed(2)}`
          )}
        </p>
      </div>
    </motion.div>
  );
}