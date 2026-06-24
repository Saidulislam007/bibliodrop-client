"use client";

import React from "react";
// 🟢 অ্যানিমেশনের জন্য framer-motion ইম্পোর্ট করা হলো ভাই
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai"; // স্টার রেটিং এর জন্য আইকন ভাই

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      text: `"BiblioDrop changed how I read. I can now access books from libraries across the city without leaving home. Absolutely brilliant service!"`,
      name: "Michael Foster",
      role: "Graduate Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    },
    {
      id: 2,
      text: `"As a librarian, BiblioDrop expanded our reach tremendously. We now serve readers who never could visit our physical location."`,
      name: "Amanda Lee",
      role: "Head Librarian",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
    },
    {
      id: 3,
      text: `"The delivery is always on time, and the book condition is excellent. The verified review system helps me pick the right books every time."`,
      name: "David Park",
      role: "Avid Reader",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
    },
  ];

  // 📝 প্যারেন্ট র্যাপারের জন্য স্ট্যাগারড অ্যানিমেশন ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // ⏱️ প্রতিটা রিভিউ কার্ড ০.১৫ সেকেন্ড পর পর আসবে ভাই
      },
    },
  };

  // 🎴 একক রিভিউ কার্ডের এন্ট্রান্স অ্যানিমেশন ভ্যারিয়েন্ট (স্প্রিং ফিজিক্স)
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 14,
      },
    },
  };

  // 🏷️ হেডিং ও সাবটাইটেল এর জন্য অ্যানিমেশন
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
      
      {/* ==================== ✍️ হেডার অ্যানিমেশন সেকশন ==================== */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={headerVariants}
        className="max-w-7xl mx-auto flex flex-col items-center text-center mb-14"
      >
        {/* ✍️ মেইন হেডিং (Loved by Readers) ও গোল্ডেন আন্ডারলাইন ভাই */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight relative pb-4">
          Loved by Readers
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full" />
        </h2>

        {/* 📝 সাব-হেডিং টেক্সট */}
        <p className="text-slate-500 text-xs sm:text-sm mt-4 font-medium max-w-xl leading-relaxed">
          Don't just take our word for it — hear from our happy community.
        </p>
      </motion.div>

      {/* ==================== 🎴 রিভিউ কার্ড গ্রিড এরিয়া ==================== */}
      {/* মোবাইলে ১টি এবং বড় স্ক্রিনে ৩টি কার্ড পাশাপাশি পারফেক্টলি ফিট হবে ভাই */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {reviews.map((rev) => (
          <motion.div 
            key={rev.id} 
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.03)"
            }}
            whileTap={{ scale: 0.99 }}
            className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 group relative cursor-pointer"
          >
            <div className="space-y-4 mt-20">
              {/* ⭐ ছবিতে থাকা ৫টি গোল্ডেন স্টার রেটিং ম্যাট্রিক্স ভাই */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} size={16} />
                ))}
              </div>

              {/* 💬 মেইন রিভিউ টেক্সট (ইটালিক এবং টেক্সট জাস্টিফাইড ভাই) */}
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed italic text-justify">
                {rev.text}
              </p>
            </div>

            {/* 👤 রিভিউ প্রদানকারীর প্রোফাইল ডেটা (নিচে ফিক্সড লকড ভাই) */}
            <div className="flex items-center gap-3 mt-8 pt-4 border-t border-slate-50">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-inner shrink-0">
                <img 
                  src={rev.image} 
                  alt={rev.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-left truncate">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                  {rev.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5 uppercase">
                  {rev.role}
                </p>
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}