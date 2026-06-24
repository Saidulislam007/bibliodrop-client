"use client";

import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// 🟢 ডাটাবেজ থেকে বইয়ের লিস্ট নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই
import { getBooks } from "@/lib/api/books"; 

export default function CategoryRatioChart() {
  // 🔄 পাই-চার্টের ডেটা ডাইনামিকালি ট্র্যাকিং করার জন্য লোকাল স্টেট ভাই
  const [pieData, setPieData] = useState([
    { name: "History", value: 0 },
    { name: "Romance", value: 0 },
    { name: "Mystery", value: 0 },
    { name: "Sci-Fi", value: 0 },
    { name: "Academic", value: 0 },
  ]);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

  useEffect(() => {
    const processCategoryData = async () => {
      try {
        // এপিআই কল করে ডাটাবেজের সমস্ত বই নিয়ে আসা হলো ভাই
        const data = await getBooks("", ""); 
        
        let booksArray = [];
        if (Array.isArray(data)) {
          booksArray = data;
        } else if (data && Array.isArray(data.books)) {
          booksArray = data.books;
        }

        // 🎯 ক্যাটাগরি অনুযায়ী অবজেক্ট কাউন্টার ডিক্লেয়ার ভাই
        const categoryCounts = {
          "History": 0,
          "Romance": 0,
          "Mystery": 0,
          "Sci-Fi": 0,
          "Academic": 0
        };

        // 🎯 ডাটাবেজ লুপ: প্রতিটি বইয়ের ক্যাটাগরি ধরে ম্যাচিং কাউন্ট বাড়ানো হলো ভাই
        booksArray.forEach((book) => {
          // ডেটাবেজে থাকা ক্যাটাগরি টেক্সটকে প্রজেক্টের ক্যাটাগরির সাথে পিনপয়েন্ট সিঙ্ক করা হলো ভাই
          if (book.category && categoryCounts[book.category] !== undefined) {
            categoryCounts[book.category] += 1;
          }
        });

        // 🎯 Recharts চার্টের ফরম্যাটে ডেটা ম্যাপ করা হলো ভাই
        const formattedPieData = Object.keys(categoryCounts).map((catName) => ({
          name: catName,
          value: categoryCounts[catName]
        }));

        // লোকাল চার্ট স্টেট আপডেট লক করা হলো ভাই
        setPieData(formattedPieData);

      } catch (error) {
        console.error("Error formatting category ratio data inside chart node:", error);
      }
    };

    processCategoryData();
  }, []);

  return (
    <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Category Ratio</h3>
      <div className="w-full h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
              {pieData.map((e, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400 px-2">
        {pieData.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
            <span className="truncate">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}