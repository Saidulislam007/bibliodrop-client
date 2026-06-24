"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// 🟢 আপনার এপিআই মেথড ইম্পোর্ট করা হলো ভাই
import { getBooks } from "@/lib/api/books";

export default function CategoryPieChart() {
  const [chartData, setChartData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true); // Recharts উইডথ-হাইট ক্র্যাশ ওয়ার্নিং ফিক্স গেটওয়ে ভাই

    const fetchAndFormatCategoryData = async () => {
      try {
        setLoading(true);
        // ১. ডাটাবেজ থেকে সমস্ত বইয়ের অ্যারে এক টানে আনা হলো ভাই
        const data = await getBooks("", "");
        
        let fetchedBooks = Array.isArray(data) ? data : data?.books || [];

        if (fetchedBooks.length > 0) {
          // 🎯 ২. [🧠 ডাইনামিক কাউন্টিং লজিক] ক্যাটাগরি ওয়াইজ বইয়ের সংখ্যা গ্রুপ এবং সামেশন করা হচ্ছে ভাই
          const categoryCounts = fetchedBooks.reduce((acc, book) => {
            const catName = book.category || "Uncategorized";
            acc[catName] = (acc[catName] || 0) + 1;
            return acc;
          }, {});

          // ৩. Recharts এর ফরম্যাট [ { name: "Sci-Fi", value: 1 } ] অনুযায়ী অবজেক্ট অ্যারে তৈরি ভাই
          const formattedData = Object.keys(categoryCounts).map((key) => ({
            name: key,
            value: categoryCounts[key],
          }));

          setChartData(formattedData);
        } else {
          // কোনো বই না থাকলে ডিফল্ট ডামি স্ট্রাকচার ব্যাকআপ
          setChartData([
            { name: "Romance", value: 50 },
            { name: "History", value: 50 },
          ]);
        }
      } catch (error) {
        console.error("Error generating dynamic category matrix for pie chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFormatCategoryData();
  }, []);

  const COLORS = ["#4f46e5", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-black border border-slate-200 rounded-2xl p-6 max-w-xl shadow-sm text-slate-800"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Books by Category</h3>
      
      <div className="w-full h-56 flex items-center justify-center text-xs font-bold min-w-0">
        {loading || !isMounted ? (
          <p className="text-slate-400 animate-pulse text-[11px]">GENERATING CATEGORY MATRIX...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                cx="50%" 
                cy="50%" 
                innerRadius={0} 
                outerRadius={75} 
                dataKey="value" 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* 🟢 লাইট থিম টুলটিপ কনফিগারেশন ভাই */}
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}