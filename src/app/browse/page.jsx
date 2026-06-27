"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiTruck, FiCalendar, FiUser, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getBooks } from "@/lib/api/books"; 
import { Loader } from "lucide-react";

export default function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔍 সার্চ, ফিল্টার এবং সর্ট স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  // 🔢 পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // প্রতি পেজে ৬টি করে আইটেম লোড হবে

  const categories = ["All", "History", "Romance", "Mystery", "Sci-Fi", "Academic"];

  // 🔄 ডাটাবেজ থেকে রিয়েল ডাটা ফেচ করা (সব বই একসাথে এনে ক্লায়েন্ট সাইড পেজিনেশন করা হচ্ছে ভাই)
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        // সব বই একসাথে আনার জন্য লিমিট বাড়িয়ে কল করা হলো যাতে সার্চ/ফিল্টার পারফেক্ট কাজ করে
        const data = await getBooks(1, 9999); 
        
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
  }, []); // 👈 এক টানে সব বই চলে আসবে, বার বার এপিআই হিট হবে না

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
      return new Date(b.dateAdded || b.publishedAt) - new Date(a.dateAdded || a.publishedAt);
    });

  // 📊 ফিল্টার করা বইয়ের ওপর ভিত্তি করে ডাইনামিক টোটাল পেজ হিসাব (যেমন: ১, ২, ３, ৪)
  const totalPages = Math.max(Math.ceil(filteredBooks.length / itemsPerPage), 1);

  // ✂️ কারেন্ট পেজের জন্য নির্দিষ্ট ৬টি বই স্লাইস (Slice) করা হলো
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPaginatedBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  // সার্চ বা ক্যাটাগরি চেঞ্জ হলে পেজ নম্বর অটোমেটিক ১ এ রিসেট করার জন্য সেফগার্ড
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="w-full mt-[-65] bg-white text-slate-800 font-sans min-h-screen pb-20">
      
      {/* ==================== ১. টপ হিরো ব্যানার সেকশন ==================== */}
      <div className="w-full bg-black text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 lg:pt-30 relative overflow-hidden isolate">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#0091ff]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0091ff] bg-[#0091ff]/10 px-3 py-1 rounded-full">
              ⚡ LIVE PIPELINE UPDATED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Explore Global <span className="text-[#0091ff]">Library Catalog</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Discover, read, and request delivery for premium catalog assets. Librarians across your city have just loaded these premium drops into the BiblioDrop mesh.
            </p>
          </div>
          
          <div className="flex gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md shrink-0">
            <div className="text-center px-4">
              <p className="text-xl font-black text-[#0091ff]">Mesh</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Node</p>
            </div>
            <div className="w-px bg-zinc-800 h-10 my-auto" />
            <div className="text-center px-4">
              <p className="text-xl font-black text-white">{filteredBooks.length}+</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Filtered Assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ২. সার্চ, ফিল্টার এবং সর্ট Controls ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search assets by title or author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full py-3 px-6 text-xs font-medium focus:outline-none focus:border-[#0091ff] focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-44 bg-slate-50 border border-slate-200 text-slate-700 rounded-full py-3 px-4 text-xs font-bold focus:outline-none focus:border-[#0091ff] cursor-pointer transition-all shadow-sm"
            >
              <option value="latest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-xl w-fit shrink-0 shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== ৩. বুক কার্ডস গ্রিড ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <Loader className="mx-auto my-20 text-[#0091ff] w-12 h-12 animate-spin" />
        ) : currentPaginatedBooks.length === 0 ? (
          <div className="w-full text-center py-20 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-2xl">
            No active book assets recorded in this specific pipeline channel token.
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              <AnimatePresence mode="popLayout">
                {currentPaginatedBooks.map((book) => {
                  const isOutOfStock = (book.stockQuantity || 0) < 1;
                  return (
                    <motion.div
                      layout
                      key={book._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                        
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                          <FiCalendar size={10} className="text-[#0091ff]" />
                          {book.dateAdded ? new Date(book.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Just now"}
                        </span>

                        <span className={`absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${
                          isOutOfStock ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                        }`}>
                          {isOutOfStock ? "Unavailable" : "Available"}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#0091ff] uppercase tracking-widest">
                            <span>{book.category}</span>
                            <span className="text-amber-500 font-extrabold text-xs">${book.price || "0"}</span>
                          </div>
                          
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-1 group-hover:text-[#0091ff] transition-colors">
                            {book.title}
                          </h3>
                          
                          <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                            <FiUser size={12} /> By {book.author}
                          </p>
                          
                          <p className="text-xs text-slate-500 leading-relaxed pt-2 line-clamp-2">
                            {book.description || "No description loaded for this library node asset portfolio."}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <Link 
                            href={`/browse/${book._id}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0091ff] hover:bg-[#007be6] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                          >
                            <FiTruck size={13} />
                            <span>Request Delivery (${book.fee?.toFixed(2) || "0.00"})</span>
                          </Link>
                          
                          <Link 
                            href={`/browse/${book._id}`}
                            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 rounded-xl transition-colors flex items-center justify-center" 
                          >
                            <FiEye size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* ==================== 🎯 ৪. ডাইনামিক পেজিনেশন নেভিগেশন কন্ট্রোলস (১, ২, ৩, ৪ বাটন সম্পূর্ণ সচল ভাই) ==================== */}
            <div className="w-full flex items-center justify-center gap-3 pt-16">
              
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center justify-center active:scale-95"
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Page Number Buttons */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-2xl text-xs font-black border transition-all flex items-center justify-center active:scale-95 ${
                      currentPage === pageNum
                        ? "bg-black text-white border-black shadow-md shadow-black/10"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center justify-center active:scale-95"
              >
                <FiChevronRight size={20} />
              </button>
              
            </div>
          </>
        )}
      </div>

    </div>
  );
}