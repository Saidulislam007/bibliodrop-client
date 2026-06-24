"use client";

import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { FiBook } from "react-icons/fi";
// 🟢 ডাটাবেজ থেকে বইয়ের লিস্ট নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই
import { getBooks } from "@/lib/api/books"; 

export default function TotalBooksCard({ value: initialValue = "4,850" }) {
  // 🔄 বইয়ের টোটাল কাউন্ট ট্র্যাক করার জন্য লোকাল স্টেট ভাই
  const [booksCount, setBooksCount] = useState(initialValue);

  useEffect(() => {
    const fetchBooksLength = async () => {
      try {
        const data = await getBooks("", ""); 
        
        // ডাটাবেজের রেসপন্স অ্যারে নাকি অবজেক্টের ভেতর .books প্রোপার্টি, তা নিখুঁতভাবে চেক করা হলো ভাই
        if (Array.isArray(data)) {
          setBooksCount(data.length.toLocaleString());
        } else if (data && Array.isArray(data.books)) {
          setBooksCount(data.books.length.toLocaleString());
        } else if (data && typeof data.total === "number") {
          setBooksCount(data.total.toLocaleString());
        }
      } catch (error) {
        console.error("Error loading total books count inside card node:", error);
      }
    };

    fetchBooksLength();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between shadow-md">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Books</p>
        {/* 🎯 ডাটাবেজের রিয়েল-টাইম সম্পূর্ণ বইয়ের লেংথ এখানে ডাইনামিকালি বসে যাবে ভাই */}
        <p className="text-xl font-black text-white">{booksCount}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <FiBook size={22} />
      </div>
    </div>
  );
}