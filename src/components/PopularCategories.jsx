"use client";

import React from "react";
import Link from "next/link";
// 🟢 অ্যানিমেশনের জন্য framer-motion ইম্পোর্ট করা হলো ভাই
import { motion } from "framer-motion";
import { 
  FiBookOpen, FiZap, FiAward, FiHeart, 
  FiSearch, FiUser, FiGlobe, FiSmile, FiArrowRight 
} from "react-icons/fi";

export default function PopularCategories() {
  const categories = [
    {
      name: "Fiction",
      count: "2.4K+ books",
      href: "/browse?category=Fiction",
      icon: <FiBookOpen size={18} />,
      colorClass: "bg-indigo-50 text-indigo-600",
    },
    {
      name: "Sci-Fi",
      count: "1.8K+ books",
      href: "/browse?category=Sci-Fi",
      icon: <FiZap size={18} />,
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      name: "Academic",
      count: "3.1K+ books",
      href: "/browse?category=Academic",
      icon: <FiAward size={18} />,
      colorClass: "bg-emerald-50 text-emerald-600",
    },
    {
      name: "Romance",
      count: "2.1K+ books",
      href: "/browse?category=Romance",
      icon: <FiHeart size={18} />,
      colorClass: "bg-rose-50 text-rose-600",
    },
    {
      name: "Mystery",
      count: "1.5K+ books",
      href: "/browse?category=Mystery",
      icon: <FiSearch size={18} />,
      colorClass: "bg-amber-50 text-amber-600",
    },
    {
      name: "Biography",
      count: "980+ books",
      href: "/browse?category=Biography",
      icon: <FiUser size={18} />,
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      name: "History",
      count: "1.2K+ books",
      href: "/browse?category=History",
      icon: <FiGlobe size={18} />,
      colorClass: "bg-orange-50 text-orange-700",
    },
    {
      name: "Self-Help",
      count: "1.7K+ books",
      href: "/browse?category=Self-Help",
      icon: <FiSmile size={18} />,
      colorClass: "bg-teal-50 text-teal-600",
    },
  ];

  // 📝 প্যারেন্ট গ্রিডের জন্য স্ট্যাগারড কোরিওগ্রাফি ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // ⏱️ প্রতিটা কার্ড একটার পর একটা স্মুথলি পপ করবে ভাই
      },
    },
  };

  // 🎴 কার্ডের এন্ট্রান্স অ্যানিমেশন (হালকা নিচ থেকে ওপরে স্লাইড এবং ফেইড-ইন)
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14,
      },
    },
  };

  // 🏷️ ওপরের ব্যাজ এবং হেডিং এর জন্য সিম্পল ফেইড-ইন
  const headerVariants = {
    hidden: { opacity: 0, y: -15 },
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
        {/* 🏷️ ওপরে থাকা ছোট ব্যাজটি */}
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 shadow-sm">
          <FiBookOpen size={12} />
          <span>Explore Genres</span>
        </div>

        {/* ✍️ মেইন হেডিং ও গোল্ডেন লাইন */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight relative pb-4">
          Popular Categories
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full" />
        </h2>

        {/* 📝 সাব-হেডিং টেক্সট */}
        <p className="text-slate-500 text-xs sm:text-sm mt-4 font-medium max-w-xl leading-relaxed">
          Browse books by your favorite genres and find your next adventure.
        </p>
      </motion.div>

      {/* ==================== 🎴 ক্যাটাগরি কার্ড গ্রিড এরিয়া ==================== */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={cardVariants}
            whileHover={{ 
              y: -4, 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-300 group cursor-pointer"
          >
            {/* Link দিয়ে পুরো কার্ড র‍্যাপ করা হলো যাতে এসইও এবং নেভিগেশন ঠিক থাকে */}
            <Link href={cat.href} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {/* 🎨 বাম পাশের সফট কালারফুল আইকন বক্স (হোভার করলে আইকনটি ওবল বা একটু টুইস্ট হবে ভাই) */}
                <motion.div 
                  whileHover={{ rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className={`w-12 h-12 ${cat.colorClass} rounded-xl flex items-center justify-center font-bold shrink-0 shadow-inner`}
                >
                  {cat.icon}
                </motion.div>
                
                {/* 📝 নাম ও বুঁক কাউন্টার */}
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </div>

              {/* ➡️ ডান পাশের অ্যারো আইকন (হোভার করলে ডানে ১ লেভেল পুশ হবে) */}
              <div className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 pr-1 shrink-0">
                <FiArrowRight size={14} className="stroke-[2.5]" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}