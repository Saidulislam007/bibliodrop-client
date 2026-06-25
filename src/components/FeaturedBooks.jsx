"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/api/books"; // আপনার তৈরি করা এপিআই ফেচ ফাংশন
// 🟢 ফিক্সড: FiUser আইকনটি এখানে ইমপোর্টলিস্টে যুক্ত করা হলো ভাই
import { FiLoader, FiTruck, FiEye, FiCalendar, FiUser } from "react-icons/fi";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        // ডাটাবেজ থেকে লেটেস্ট পাবলিশড বইগুলো বেশি পরিমাণে নিয়ে আসার জন্য প্যারামিটার পাস (Page 1, Limit 50)
        const data = await getBooks(1, 50);
        
        let allBooks = [];
        if (Array.isArray(data)) {
          allBooks = data;
        } else if (data?.books) {
          allBooks = data.books;
        }

        // শুধুমাত্র 'Published' স্ট্যাটাস ফিল্টার করা এবং নতুন বইগুলো ডেট অনুযায়ী সর্ট করে প্রথম ৬টি নেওয়া
        const publishedBooks = allBooks
          .filter(book => book.status === "Published" || book.isPublished === true)
          .sort((a, b) => new Date(b.dateAdded || b.publishedAt) - new Date(a.dateAdded || a.publishedAt))
          .slice(0, 6); // প্রথম ६টি বই লক করা হলো ভাই

        setBooks(publishedBooks);
      } catch (error) {
        console.error("Error loading featured books node:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // ডেট ফরম্যাট করার হেল্পার ফাংশন (যেমন: Jun 24)
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400">
        <FiLoader size={24} className="animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider">LOADING FEATURED REGISTRIES...</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-slate-50/50">
      
      {/* 📋 সেকশন হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Books</h2>
          <p className="text-xs text-slate-500 mt-1">Explore our latest local library arrivals and hot drops.</p>
        </div>
        
        {/*桌面 ভিউর জন্য See More বাটন */}
        <Link 
          href="/books" 
          className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          See More Books
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs font-semibold tracking-wide border border-dashed border-slate-200 rounded-2xl bg-white">
          No published books pipeline detected at the moment.
        </div>
      ) : (
        /* 🎴 বুকস গ্রিড লেআউট - image_769636.png এর মতো হুবহু ডিজাইন ভাই */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div 
              key={book._id} 
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              
              {/* 🖼️ ইমেজ কন্টেইনার এবং অ্যাবসলুট ব্যাজ */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* 📅 ডেট ব্যাজ */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white font-bold text-[10px] flex items-center gap-1">
                  <FiCalendar size={10} className="text-blue-400" />
                  <span>{formatDate(book.dateAdded || book.publishedAt)}</span>
                </div>

                {/* 🟢 অ্যাভেইলেবিলিটি স্ট্যাটাস ব্যাজ */}
                <div className="absolute top-4 right-4 bg-emerald-500 px-2.5 py-1 rounded-lg text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm shadow-emerald-500/20">
                  {book.stockQuantity > 0 ? "Available" : "Out of Stock"}
                </div>
              </div>

              {/* 📝 টেক্সট ও কন্টেন্ট এরিয়া */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black text-blue-600">
                      {book.category || "General"}
                    </span>
                    <span className="text-xs font-black text-amber-500">
                      ${book.price?.toFixed(0) || "0"}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-1 capitalize">
                    {book.title}
                  </h3>
                  
                  <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <FiUser size={12} /> By {book.author}
                  </p>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-1">
                    {book.description || "No description provided for this specific book node."}
                  </p>
                </div>

                {/* ⚙️ বাটন অ্যাকশন রেন্ডার */}
                <div className="flex items-center gap-2 pt-2 w-full">
                  
                  {/* ডেলিভারি রিকোয়েস্ট বাটন */}
                  <button 
                    disabled={book.stockQuantity <= 0}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <FiTruck size={14} />
                    <span>Request Delivery (${book.fee?.toFixed(2) || "0.00"})</span>
                  </button>

                  {/* 👁️ ডিটেইলস পেজ দেখার বাটন (আইকন বাটন ভাই) */}
                  <Link 
                    href={`/books/${book._id}`}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all active:scale-95 flex-shrink-0"
                    title="View Book Details"
                  >
                    <FiEye size={15} />
                  </Link>

                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 📱 মোবাইল ভিউর জন্য নিচে দেখানো বাটন */}
      <div className="text-center sm:hidden pt-4">
        <Link 
          href="/books" 
          className="inline-flex w-full items-center justify-center px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          See More Books
        </Link>
      </div>

    </section>
  );
}