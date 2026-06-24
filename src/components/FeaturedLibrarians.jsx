"use client";

import React from "react";
// 🟢 অ্যানিমেশনের জন্য framer-motion মডিউল ইম্পোর্ট করা হলো ভাই
import { motion } from "framer-motion";
import { FiAward, FiStar, FiTruck } from "react-icons/fi";

export default function FeaturedLibrarians() {
  const librarians = [
    {
      id: 1,
      name: "Sarah Mitchell",
      library: "Downtown Public Library",
      deliveries: "1,240",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      hasTopBadge: true,
    },
    {
      id: 2,
      name: "James Rodriguez",
      library: "Heritage Books Collection",
      deliveries: "980",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
      hasTopBadge: false,
    },
    {
      id: 3,
      name: "Emily Chen",
      library: "Academic Resource Hub",
      deliveries: "856",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
      hasTopBadge: false,
    },
  ];

  // 🧱 প্যারেন্ট কন্টেইনারের জন্য স্ট্যাগারড কোরিওগ্রাফি ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // ⏱️ প্রতিটা কার্ড ০.১২ সেকেন্ড পর পর সিরিয়ালি ওপেন হবে
      },
    },
  };

  // 🎴 কার্ডের জন্য স্প্রিং ফিজিক্স এন্ট্রান্স অ্যানিমেশন
  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
      },
    },
  };

  // 🏷️ ওপরের ব্যাজ এবং হেডিং এর জন্য ফেইড-ইন ভ্যারিয়েন্ট
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      {/* ==================== ✍️ হেডার সেকশন অ্যানিমেশন ==================== */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={headerVariants}
        className="max-w-7xl mx-auto flex flex-col items-center text-center mb-12"
      >
        {/* 🏷️ ওপরে থাকা ছোট নীলচে ব্যাজ (TOP PROVIDERS) */}
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 shadow-sm">
          <FiAward size={12} />
          <span>Top Providers</span>
        </div>

        {/* ✍️ মেইন হেডিং (Featured Librarians) ও নিচের সেই গোল্ডেন লাইন */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight relative pb-4">
          Featured Librarians
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full" />
        </h2>

        {/* 📝 সাব-টেক্সট লেবেল */}
        <p className="text-slate-500 text-xs sm:text-sm mt-4 font-medium max-w-xl leading-relaxed">
          Meet our most active librarians with the highest delivery counts.
        </p>
      </motion.div>

      {/* ==================== 👥 লাইব্রেরিয়ান কার্ড গ্রিড এরিয়া ==================== */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {librarians.map((lib) => (
          <motion.div 
            key={lib.id} 
            variants={cardVariants}
            whileHover={{ 
              y: -6,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm transition-all duration-300 group relative cursor-pointer"
          >
            {/* 📸 প্রোফাইল ইমেজ র্যাপার (গোলাকার এবং বর্ডার পজিশন ভাই) */}
            <div className="relative w-24 h-24 mb-5 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                <motion.img 
                  src={lib.image} 
                  alt={lib.name} 
                  whileHover={{ scale: 1.06 }} // মাউস নিলে ছবিটা আলতো জুম ইন হবে
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 🥇 প্রথম কার্ডের ওপরে থাকা সেই গোল্ডেন মেডেল ব্যাজ নোড ভাই */}
              {lib.hasTopBadge && (
                <motion.div 
                  /* 💫 প্রো ট্রিক: ব্রেদিং/পালস অ্যানিমেশন ইফেক্ট দেওয়া হলো যাতে চোখ কাড়ে ভাই */
                  animate={{ 
                    scale: [1, 1.12, 1],
                    boxShadow: ["0px 2px 4px rgba(0,0,0,0.1)", "0px 4px 10px rgba(245,158,11,0.3)", "0px 2px 4px rgba(0,0,0,0.1)"]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full border border-white flex items-center justify-center z-10"
                >
                  <FiAward size={12} className="stroke-[2.5]" />
                </motion.div>
              )}
            </div>

            {/* 📝 লাইব্রেরিয়ানের নাম ও সংশ্লিষ্ট লাইব্রেরি */}
            <div className="space-y-1 mb-6">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200 capitalize">
                {lib.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {lib.library}
              </p>
            </div>

            {/* 📊 নিচের ডেলিভারি এবং রেটিং মেট্রিক্স ম্যাট্রিক্স */}
            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 mt-auto">
              {/* বাম পাশ: ডেলিভারি কাউন্ট */}
              <div className="flex flex-col items-center justify-center border-r border-slate-100">
                <span className="text-base font-black text-indigo-700 tracking-tight flex items-center gap-1">
                  {lib.deliveries}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Deliveries
                </span>
              </div>

              {/* ডান পাশ: স্টার রেটিং */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-base font-black text-amber-500 tracking-tight flex items-center gap-1">
                  {lib.rating}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Rating
                </span>
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}