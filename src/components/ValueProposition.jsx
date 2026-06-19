"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiClock, FiBookmark, FiTrendingUp, FiGift, FiTruck, FiMapPin, FiMail } from "react-icons/fi";

export default function ValueProposition() {
  
  // পাঠকদের মূল বেনিফিট ডাটা (আরও স্লিক এবং কর্পোরেট ইংলিশে)
  const readingBenefits = [
    {
      id: 1,
      title: "Save 3+ Hours of Commute Weekly",
      description: "Stop traveling to find titles. Select academic references, fiction, or research logs and let BiblioDrop handle the sub-hour dispatch mesh.",
      icon: <FiClock size={18} className="text-[#0091ff]" />,
      accent: "group-hover:text-[#0091ff]"
    },
    {
      id: 2,
      title: "Zero Hidden Deposits & Penalties",
      description: "Standard libraries demand high subscription overheads. With BiblioDrop, subscribe on a flexible book-by-book basis with zero asset liability.",
      icon: <FiBookmark size={18} className="text-purple-600" />,
      accent: "group-hover:text-purple-600"
    },
    {
      id: 3,
      title: "Active Gamified Incentives",
      description: "Build consistent habits. Complete monthly reading milestones to earn automated courier tokens, which can be instantly redeemed.",
      icon: <FiGift size={18} className="text-emerald-600" />,
      accent: "group-hover:text-emerald-600"
    },
  ];

  // Micro-Animations Config
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="w-full bg-white text-slate-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-slate-100">
      
      {/* 🔮 Background subtle গ্লো- স্পট */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-50/40 rounded-full blur-[120px] -z-10 pointer-events-none -translate-y-1/2" />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVars}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-16 items-center"
      >
        
        {/* ================= বাম পাশ: কিলার আর্কিটেকচারাল হেডলাইন ও বেনিফিটস ================= */}
        <div className="lg:col-span-7 space-y-8 text-center sm:text-left">
          
          <motion.div variants={itemVars} className="space-y-3">
            <span className="inline-block text-[10px] font-extrabold tracking-widest text-[#0091ff] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
              READING & DELIVERY OPTIMIZATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Pipeline <span className="text-[#0091ff]">3.5x more books</span> right to your desk every month
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto sm:mx-0">
              Stop limiting your knowledge acquisition due to physical logistics. BiblioDrop integrates decentralized neighborhood shelves directly to your workspace. Explore faster, track smarter, and enjoy automated doorstep dispatches.
            </p>
          </motion.div>

          {/* ================= 🛠️ কিলার Micro-Interactions বেনিফিটস কার্ডস ================= */}
          <div className="space-y-4 max-w-xl mx-auto sm:mx-0">
            {readingBenefits.map((benefit, idx) => (
              <motion.div 
                key={benefit.id} 
                variants={itemVars}
                whileHover={{ y: -5, scale: 1.01 }}
                className="flex gap-4 items-start text-left p-4 rounded-2xl border border-slate-200/40 bg-white hover:border-blue-100 hover:shadow-[0_10px_30px_rgba(0,145,255,0.08)] transition-all duration-300 group cursor-pointer"
              >
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0 group-hover:bg-blue-50 transition-colors shadow-inner">
                  {benefit.icon}
                </div>
                <div className="space-y-0.5">
                  <h3 className={`text-sm font-black text-slate-900 tracking-tight ${benefit.accent} transition-colors`}>
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ================= ডান পাশ: 🖼️ হাই-এন্ড অ্যানিমেটেড বুক ডেলিভারি ভিজ্যুয়াল মকআপ ================= */}
        {/* স্ক্রিনশটের বাচ্চার মতো স্ট্যাটিক বডির বদলে এখানে একটি লাইভ UI মকআপ দেওয়া হয়েছে */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-5 flex justify-center items-center w-full relative"
        >
          {/* গ্লাস মেস কন্টেইনার (টাইপফর্ম ইন্সপায়ার্ড বাট স্লিক) */}
          <div className="w-full max-w-[390px] aspect-square bg-gradient-to-tr from-slate-100/70 via-slate-50 to-blue-50/20 rounded-[32px] border border-slate-200/40 p-8 flex items-center justify-center relative shadow-inner group overflow-hidden">
            
            {/* ব্যাকগ্রাউন্ড ইন্টারঅ্যাক্টিভ পালস রিং */}
            <div className="absolute inset-12 bg-white rounded-full blur-md opacity-40 group-hover:scale-110 transition-transform duration-700" />

            {/* ================= 🖼️ মূল ভাসমান এবং অ্যানিমেটেড মকআপ প্যানেল ================= */}
            {/* এই পুরো প্যানেলটি অলসভাবে ভাসতে থাকবে */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
              className="w-72 bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.06)] space-y-4 z-10 relative flex flex-col justify-between"
            >
              
              {/* মকআপ হেডার (কুইক অ্যাকশন) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <FiMail className="text-[#0091ff]" /> Request Dispatch
                </div>
                <div className="flex gap-1.5 items-center text-[10px] text-zinc-400 font-bold font-mono">
                  Txn ID: B-881
                </div>
              </div>

              {/* 🛠️ কিলার সায়ান-গ্লো রাইডার সিমুলেশন (HMR-Client Inspired) */}
              <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-full p-2 flex items-center relative overflow-hidden group">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 h-0.5 bg-zinc-200 rounded-full w-[calc(100%-24px)]" />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "calc(100% - 24px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
                  className="absolute top-1/2 -translate-y-1/2 left-3 h-0.5 bg-[#0091ff] rounded-full z-10"
                />
                
                <div className="relative z-20 flex justify-between items-center w-full">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <FiMapPin size={11} />
                  </div>
                  <motion.div 
                    initial={{ x: 0 }}
                    whileInView={{ x: [0, 220, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 10, duration: 4, ease: "easeOut" }}
                    className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"
                  >
                    <FiTruck size={12} className="group-hover:rotate-12 transition-transform" />
                  </motion.div>
                </div>
              </div>

              {/* ভ্যালু প্রোপোজিশন ডাটা Counter কার্ড */}
              <div className="space-y-1.5 pt-1 text-center">
                <p className="text-3xl font-black text-slate-950 font-sans tracking-tight">
                  +350%
                </p>
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Reading Velocity
                </p>
                <p className="text-[11px] text-slate-400 font-medium leading-normal px-2">
                  Average growth recorded by active university students in their first 60 days.
                </p>
              </div>

              {/* সিস্টেম চেকমার্ক ফুটার (SaaS Status Bar inspired) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                <FiCheck className="stroke-[3]" size={12} /> Sync Verified
              </div>
            </motion.div>

            {/* সেকেন্ডারি ডেকোরেティブ নোড (UX Touch) */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-6 left-6 bg-slate-900 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              #BiblioDrop_LOGISTICS
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}