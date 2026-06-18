"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiTruck, FiCalendar, FiUser, FiSliders, FiEye, FiShoppingBag, FiStar } from "react-icons/fi";

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Fiction", "Academic", "Sci-Fi", "Biography", "Self-Help"];

  const newBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fiction",
      rating: 4.8,
      status: "Available",
      dateAdded: "2 Days ago",
      img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
      description: "Between life and death there is a library, and within that library, the shelves go on forever."
    },
    {
      id: 2,
      title: "Advanced MERN Architecture",
      author: "Dr. Alex R.",
      category: "Academic",
      rating: 4.9,
      status: "Available",
      dateAdded: "Just now",
      img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400",
      description: "Master enterprise full-stack structures using clean architecture and modern tools."
    },
    {
      id: 3,
      title: "Dune: Part 3 Saga",
      author: "Frank Herbert",
      category: "Sci-Fi",
      rating: 4.7,
      status: "Pre-Order",
      dateAdded: "1 Day ago",
      img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400",
      description: "The sweeping galactic masterclass of politics, ecology, and human evolution continues."
    },
    {
      id: 4,
      title: "Elon Musk: A Radical Life",
      author: "Walter Isaacson",
      category: "Biography",
      rating: 4.6,
      status: "Available",
      dateAdded: "3 Days ago",
      img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400",
      description: "The astonishingly intimate story of the world’s most controversial and innovative titan."
    },
    {
      id: 5,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      rating: 4.9,
      status: "Available",
      dateAdded: "5 Days ago",
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
      description: "An easy & proven way to build good habits & break bad ones with incremental progress."
    },
    {
      id: 6,
      title: "The Quantum Enigma",
      author: "Bruce Rosenblum",
      category: "Sci-Fi",
      rating: 4.5,
      status: "Rented",
      dateAdded: "4 Days ago",
      img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400",
      description: "Physics encounters consciousness in this brilliant and accessible mind-bending narrative."
    }
  ];

  // ক্যাটাগরি অনুযায়ী ফিল্টারিং লজিক
  const filteredBooks = selectedCategory === "All" 
    ? newBooks 
    : newBooks.filter(book => book.category === selectedCategory);

  return (
    <div className="w-full bg-white text-slate-800 font-sans min-h-screen pb-20">
      
      {/* ==================== ১. টপ হিরো ব্যানার সেকশন (SaaS থিম) ==================== */}
      <div className="w-full bg-black text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden isolate">
        {/* অ্যাম্বিয়েন্ট লাইট গ্লো ইফেক্ট */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#0091ff]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0091ff] bg-[#0091ff]/10 px-3 py-1 rounded-full">
              ⚡ LIVE PIPELINE UPDATED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Fresh Off The Press: <span className="text-[#0091ff]">New Arrivals</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Explore the latest updates in our global book inventory. Librarians across your city have just loaded these premium drops into the BiblioDrop mesh.
            </p>
          </div>
          
          {/* মাইক্রো স্ট্যাটস ট্র্যাক */}
          <div className="flex gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md shrink-0">
            <div className="text-center px-4">
              <p className="text-xl font-black text-[#0091ff]">48h</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rotation Rate</p>
            </div>
            <div className="w-px bg-zinc-800 h-10 my-auto" />
            <div className="text-center px-4">
              <p className="text-xl font-black text-white">120+</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">New Titles This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ২. ক্যাটাগরি ফিল্টার কন্ট্রোলস ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <FiSliders size={14} className="text-[#0091ff]" />
          <span>Filter Channels</span>
        </div>
        
        {/* কাস্টম টগল গ্রুপ */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-xl w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== ৩. বুক কার্ডস গ্রিড (অ্যানিমেটেড) ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {filteredBooks.length === 0 ? (
          <div className="w-full text-center py-20 text-slate-400 text-sm font-medium">
            No new book drops recorded in this specific pipeline channel.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <motion.div
                  layout
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* ইমেজ এবং ব্যাজ হোল্ডার */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                    <img src={book.img} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* ডাইনামিক টপ টাইমস্ট্যাম্প */}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                      <FiCalendar size={10} className="text-[#0091ff]" /> {book.dateAdded}
                    </span>

                    {/* বুক স্ট্যাটাস ফ্ল্যাগ */}
                    <span className={`absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${
                      book.status === "Available" ? "bg-emerald-500 text-white" :
                      book.status === "Pre-Order" ? "bg-amber-500 text-white" :
                      "bg-slate-400 text-white"
                    }`}>
                      {book.status}
                    </span>
                  </div>

                  {/* টেক্সট কন্টেন্ট ইনফো এরিয়া */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#0091ff] uppercase tracking-widest">
                        <span>{book.category}</span>
                        <span className="flex items-center gap-0.5 text-amber-500"><FiStar size={12} fill="currentColor" /> {book.rating}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-1 group-hover:text-[#0091ff] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <FiUser size={12} /> By {book.author}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed pt-2 line-clamp-2">
                        {book.description}
                      </p>
                    </div>

                    {/* ই-কমার্স ও ডেলিভারি কল-টু-অ্যাকশন বাটন */}
                    <div className="pt-2 flex items-center gap-2">
                      <button 
                        disabled={book.status === "Rented"}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0091ff] hover:bg-[#007be6] disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <FiTruck size={13} />
                        <span>{book.status === "Pre-Order" ? "Pre-Order Delivery" : "Request Delivery"}</span>
                      </button>
                      <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 rounded-xl transition-colors" aria-label="Quick View">
                        <FiEye size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}