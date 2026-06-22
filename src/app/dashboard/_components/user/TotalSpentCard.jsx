import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

// 🟢 মেইন পেজ থেকে ডাইনামিক 'value' প্রপ্স হিসেবে রিসিভ করা হচ্ছে ভাই
export default function TotalSpentCard({ value }) {
  return (
    <motion.div 
      // 🎬 ইনিশিয়াল ও এন্ট্রান্স অ্যানিমেশন লজিক
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }} // হালকা ডিলে দেওয়া হয়েছে সিঙ্কের জন্য ভাই
      
      // ✨ ইন্টারঅ্যাক্টিভ হোভার ইফেক্ট
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        borderColor: "rgba(63, 63, 70, 0.8)" 
      }}
      className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors duration-200"
    >
      {/* আইকন কন্টেইনার */}
      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
        <FiDollarSign size={20} />
      </div>
      
      {/* টেক্সট এবং লাইভ টোটাল খরচ এরিয়া */}
      <div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Total Spent on Fees
        </p>
        
        {/* 🎯 ডাইনামিক যোগফল ডিসপ্লে */}
        <p className="text-lg font-black text-white mt-0.5">
          ${value !== undefined && value !== null ? value : "0.00"}
        </p>
      </div>
    </motion.div>
  );
}