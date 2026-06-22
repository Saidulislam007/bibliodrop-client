import React from "react";
import { FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

export default function TotalBooksCard({ value }) {
  return (
    <motion.div 
      // 🎬 ইনিশিয়াল ও এন্ট্রান্স অ্যানিমেশন লজিক
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      
      // ✨ ইন্টারঅ্যাক্টিভ হোভার ইফেক্ট
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        borderColor: "rgba(63, 63, 70, 0.8)" 
      }}
      className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors duration-200"
    >
      {/* আইকন কন্টেইনার */}
      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
        <FiBookOpen size={20} />
      </div>
      
      {/* মেটাডাটা টেক্সট ব্লক */}
      <div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Total Books Read
        </p>
        <p className="text-lg font-black text-white mt-0.5">
          {value || "0 Books"}
        </p>
      </div>
    </motion.div>
  );
}