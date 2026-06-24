"use client";

import React from "react";
// 🟢 অ্যানিমেশনের জন্য framer-motion ইম্পোর্ট করা হলো ভাই
import { motion } from "framer-motion";
import { FiBook, FiUsers, FiBookOpen, FiStar } from "react-icons/fi";

export default function StatsSection() {
  const stats = [
    {
      id: 1,
      metric: "50K+",
      label: "Books Available",
      icon: <FiBook size={24} className="text-amber-400" />,
    },
    {
      id: 2,
      metric: "12K+",
      label: "Happy Readers",
      icon: <FiUsers size={24} className="text-amber-400" />,
    },
    {
      id: 3,
      metric: "500+",
      label: "Local Libraries",
      icon: <FiBookOpen size={24} className="text-amber-400" />,
    },
    {
      id: 4,
      metric: "98%",
      label: "Satisfaction Rate",
      icon: <FiStar size={24} className="text-amber-400" />,
    },
  ];

  // 📝 প্যারেন্ট কন্টেইনারের জন্য স্ট্যাগার অ্যানিমেশন ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // ⏱️ প্রতিটা কার্ড ০.১৫ সেকেন্ড পর পর আসবে ভাই
      },
    },
  };

  // 🎴 একক কার্ডের ওপর নিচ ও ওয়ান-টাইম স্কেল অ্যানিমেশন ভ্যারিয়েন্ট
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    // 🌐 ছবিতে থাকা ব্যাকগ্রাউন্ডের মতো নিখুঁত ইন্ডিগো-ভায়োলেট গ্রেডিয়েন্ট থিম (bg-black এর সাথে bg-gradient-to-r ফিক্সড)
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} // স্ক্রিনে আসার সাথে সাথে ১ বারই অ্যানিমেট হবে
      className="w-full bg-black  via-indigo-900 to-purple-950 text-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-lg my-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center justify-center">
        
        {stats.map((stat) => (
          <motion.div 
            key={stat.id} 
            variants={cardVariants}
            className="flex flex-col items-center justify-center space-y-2 group cursor-pointer"
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2, ease: "easeInOut" } 
            }}
            whileTap={{ scale: 0.98 }} // টাচ বা ক্লিক করলে হালকা প্রেস ডাউন হবে ভাই
          >
            {/* 🏅 টপ গোল্ডেন আইকন র‍্যাপার এবং এর ভেতরের আইকন হোভার অ্যানিমেশন */}
            <motion.div 
              className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-sm mb-1 group-hover:bg-white/10 group-hover:border-white/20 transition-colors duration-300"
              whileHover={{ rotate: [0, -10, 10, 0] }} // মাউস নিলে আইকনটি হালকা দুলবে
              transition={{ duration: 0.4 }}
            >
              {stat.icon}
            </motion.div>

            {/* 🔢 মেইন কাউন্টার নাম্বার */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors duration-300">
              {stat.metric}
            </h2>

            {/* 📝 সাব-টেক্সট লেবেল */}
            <p className="text-[11px] sm:text-xs font-bold text-indigo-200/70 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>
    </motion.div>
  );
}