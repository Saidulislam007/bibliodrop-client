"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// 🟢 Framer Motion থেকে প্রিমিয়াম এনিমেশন মডিউল ভাই
import { motion, AnimatePresence } from "framer-motion";
import { FiTruck, FiCalendar, FiUser, FiEye, FiSearch, FiLoader, FiArrowRight, FiSliders } from "react-icons/fi";
import { getBooks } from "@/lib/api/books"; 

export default function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔍 সার্চ, ফিল্টার এবং সর্ট স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const categories = ["All", "History", "Romance", "Mystery", "Sci-Fi", "Academic"];

  // 🔄 ডাটাবেজ থেকে রিয়েল ডাটা ফেচ করা
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks("", ""); 
        
        let fetchedBooks = Array.isArray(data) ? data : data?.books || [];
        
        // 🛡️ শুধুমাত্র "status": "Published" থাকা বইগুলো ফিল্টার করা হলো ভাই
        const publicCatalog = fetchedBooks.filter(book => book.status === "Published");
        setBooks(publicCatalog);
      } catch (err) {
        console.error("Catalog load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  // ⚙️ ক্লায়েন্ট সাইড সার্চ, ফিল্টারিং ও সর্টিং লজিক
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      
      const dateA = new Date(a.dateAdded || a.publishedAt || 0);
      const dateB = new Date(b.dateAdded || b.publishedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 6); // 🎯 সর্বোচ্চ ৬টি বই দেখানো হচ্ছে

  // 📋 🌟 Framer Motion এনিমেশন কনফিগারেশন ভাই
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }, 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 18 }
    },
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0c0d] text-slate-800 dark:text-zinc-200 font-sans min-h-screen pb-12 transition-colors">
      
      <div className="bg-white dark:bg-[#0b0c0d]">
        {/* ==================== ১. টপ হিরো ব্যানার সেকশন ==================== */}
        <div className="w-full bg-white dark:bg-[#0b0c0d] py-14 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden isolate">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12 }
                }
              }}
              className="space-y-3 text-center md:text-left max-w-xl"
            >
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                className="inline-block text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full"
              >
                ⚡ LIVE PIPELINE UPDATED
              </motion.span>
              
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                }}
                className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight"
              >
                Explore Global <span className="text-indigo-400">Library Catalog</span>
              </motion.h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed"
              >
                Discover, read, and request delivery for premium catalog assets. Librarians across your city have just loaded these premium drops into the BiblioDrop mesh.
              </motion.p>
            </motion.div>
            
          </div>
        </div>

        {/* ==================== ২. সার্চ, ফিল্টার এবং সর্ট কন্ট্রোলস (ডাইনামিক ও রেসপনসিভ ভাই) ==================== */}
        

        {/* ==================== ৩. বুক کارت্স গ্রিড ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#121314] border border-slate-100 dark:border-zinc-800/60 h-[420px] rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="w-full h-48 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                  <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="w-full text-center py-20 text-slate-400 dark:text-zinc-500 text-xs font-bold tracking-wider uppercase border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#121314]">
              No active book assets recorded in this specific pipeline channel token.
            </div>
          ) : (
            <>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book) => {
                    const currentBookId = book._id?.$oid || book._id;
                    const isOutOfStock = (book.stockQuantity || 0) < 1;
                    
                    return (
                      <motion.div
                        layout
                        key={currentBookId}
                        variants={cardVariants}
                        whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeInOut" } }}
                        className="bg-white dark:bg-[#121314] border border-slate-200/60 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                      >
                        {/* 📸 ১. টপ ইমেজ এরিয়া */}
                        <div className="relative aspect-[16/10] bg-slate-100 dark:bg-zinc-950 overflow-hidden shrink-0 m-3 rounded-2xl">
                          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <FiCalendar size={11} className="text-cyan-400" />
                            {book.dateAdded ? new Date(book.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Jun 22"}
                          </span>
                          <span className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm ${isOutOfStock ? "bg-rose-500" : "bg-emerald-500"}`}>
                            {isOutOfStock ? "Unavailable" : "Available"}
                          </span>
                        </div>

                        {/* 📝 ২. মিডেল কন্টেন্ট এরিয়া */}
                        <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                              <span className="text-indigo-600 dark:text-indigo-400">{book.category}</span>
                              <span className="text-amber-500 font-extrabold text-sm">${book.price || "300"}</span>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-indigo-500 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                              <FiUser size={12} /> By {book.author}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pt-1 line-clamp-2 min-h-[36px]">
                              {book.description}
                            </p>
                          </div>

                          {/* 🛠️ ৩. বটম অ্যাকশন বাটন সেকশন */}
                          <div className="pt-2 flex items-center gap-2 w-full">
                            <Link href={`/browse/${currentBookId}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-black hover:bg-[#0d0d0e] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]">
                              <FiTruck size={14} />
                              <span>Request Delivery (${book.fee ? book.fee.toFixed(2) : "4.50"})</span>
                            </Link>
                            <Link href={`/browse/${currentBookId}`} className="p-3 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl transition-colors flex items-center justify-center">
                              <FiEye size={14} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* ==================== 🎯 ৪. SEE MORE BOOKS BUTTON ==================== */}
              <div className="w-full flex justify-center pt-8">
                <Link href="/browse">
                  <motion.button
                    whileHover={{ scale: 1.04, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white text-xs font-black uppercase tracking-wider rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors"
                  >
                    <span>See More Books</span>
                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}