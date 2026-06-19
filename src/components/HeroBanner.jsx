"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiBookOpen, FiTruck, FiShield } from "react-icons/fi";

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "⚡ DECENTRALIZED LIBRARY MESH",
      title: "Your Local Library, Delivered To Your Doorstep",
      description: "Browse thousands of certified titles from independent book owners and community libraries near you. Request delivery in seconds.",
      primaryBtn: "Explore Books",
      secondaryBtn: "How it Works",
      primaryHref: "/browse",
      secondaryHref: "/about",
      bgGradient: "from-zinc-950 via-indigo-950/40 to-black",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200",
    },
    {
      id: 2,
      tag: "📦 LIBRARIAN PROTOCOL v2.0",
      title: "Empower Your Collection, Share Your Knowledge",
      description: "Are you a librarian or book collector? List your inventory on the BiblioDrop mesh, manage rentals, and track automated delivery dispatches effortlessly.",
      primaryBtn: "Join as Provider",
      secondaryBtn: "Read Guide",
      primaryHref: "/register",
      secondaryHref: "/terms",
      bgGradient: "from-zinc-950 via-emerald-950/30 to-black",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200",
    },
    {
      id: 3,
      tag: "🎓 REWARD PROGRAM ACTIVE",
      title: "Read More. Earn System Points. Unlock Rewards.",
      description: "Join the ultimate book marketplace where consistency is rewarded. Accumulate reading logs, complete monthly drops, and win automated courier credits.",
      primaryBtn: "Create Account",
      secondaryBtn: "View Rewards",
      primaryHref: "/register",
      secondaryHref: "/pricing",
      bgGradient: "from-zinc-950 via-purple-950/40 to-black",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="w-full relative h-[620px] sm:h-[680px] lg:h-[720px] bg-black overflow-hidden font-sans select-none">
      
      {/* ================= স্লাইডার কন্টেইনার ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${slides[currentSlide].image})` }} />
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} via-black/80 to-black/95 z-10`} />

          {/* কন্টেন্ট লেআউট */}
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center relative z-20 pb-16 md:pb-24">
            <div className="max-w-2xl space-y-6 text-left">
              
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0091ff] bg-[#0091ff]/10 border border-[#0091ff]/20 px-3 py-1 rounded-full"
              >
                {slides[currentSlide].tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1]"
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-zinc-400 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-medium"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3 pt-4"
              >
                <Link
                  href={slides[currentSlide].primaryHref}
                  className="px-5 py-3 bg-[#0091ff] hover:bg-[#007be6] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>{slides[currentSlide].primaryBtn}</span>
                  <FiArrowRight size={13} />
                </Link>
                
                <Link
                  href={slides[currentSlide].secondaryHref}
                  className="px-5 py-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                >
                  {slides[currentSlide].secondaryBtn}
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ================= ম্যানুয়াল চেভরন বাটন ================= */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/40 hover:bg-[#0091ff] border border-zinc-800/40 text-zinc-400 hover:text-white rounded-xl backdrop-blur-sm transition-all focus:outline-none active:scale-90"
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={18} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/40 hover:bg-[#0091ff] border border-zinc-800/40 text-zinc-400 hover:text-white rounded-xl backdrop-blur-sm transition-all focus:outline-none active:scale-90"
        aria-label="Next Slide"
      >
        <FiChevronRight size={18} />
      </button>

      {/* ================= 🛠️ ফিক্স ১: স্লাইড ইন্ডিকেটর ডটস-এর মার্জিন বাড়িয়ে ওপরে তোলা হয়েছে (bottom-20) ================= */}
      <div className="absolute bottom-20 left-0 right-0 z-30 flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              currentSlide === idx ? "bg-[#0091ff] w-6" : "bg-zinc-700 w-1.5 hover:bg-zinc-500"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ================= 🛠️ ফিক্স ২: ট্রাস্ট ওভারলে বারটিকে একদম নিচে লক করে z-index ব্যালেন্স করা হয়েছে ================= */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-16 pb-5 z-20 hidden md:block border-t border-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-4 text-zinc-500 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <FiBookOpen className="text-[#0091ff]" size={14} />
            <span>Verified Shared Inventories</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiTruck className="text-emerald-500" size={14} />
            <span>Automated Courier Tracking</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <FiShield className="text-purple-500" size={14} />
            <span>End-to-End Rental Insurance</span>
          </div>
        </div>
      </div>

    </div>
  );
}