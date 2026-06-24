"use client";

import React, { useState, useEffect } from "react";
import { FiLoader, FiActivity } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// 🟢 আপনার এপিআই মেথড ইম্পোর্ট
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function TransactionsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📢 স্ট্যাটাস কালার অবজেক্ট ভাই (image_e93a46.png এর থিম অনুযায়ী)
  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  // 🔄 ডাটাবেজ থেকে ডেটা লোড করার মেথড
  const loadAllTransactions = async () => {
    try {
      setLoading(true);
      const data = await getDeliveriesByEmail("");
      
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
        setTransactions(data);
      } else if (data && Array.isArray(data.deliveries)) {
        const deliveryList = data.deliveries;
        deliveryList.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
        setTransactions(deliveryList);
      } else {
        setTransactions([]); 
      }
    } catch (err) {
      console.error("Error loading delivery asset pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      loadAllTransactions();
    }
  }, [sessionLoading]); 

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>SYNCHRONIZING REVIEWS AND TRANSACTION CONTEXTS...</span>
      </div>
    );
  }

  return (
    // 📱 প্যাডিং ছোট স্ক্রিনে p-4 এবং বড় স্ক্রিনে p-8 করা হয়েছে
    <div className="p-4 sm:p-8 max-w-9xl mx-auto space-y-6 w-full relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* টাইটেল ব্লক */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manage Transactions</h1>
        <p className="text-xs sm:text-sm text-zinc-600">Administrative override command dashboard for transactions assets.</p>
      </div>

      {/* 🔮 ডার্ক রেসপনসিভ পেমেন্ট টেবিল কন্টেইনার ভাই */}
      <div className="bg-black text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-zinc-900 mt-4 min-h-[550px] flex flex-col justify-between overflow-hidden">
        {/* 📱 overflow-x-auto মোবাইল স্ক্রিনে টেবিলকে সুইপ-স্ক্রোল সুবিধা দেবে ভাই */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-2">
              <FiActivity size={24} className="text-zinc-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">No Transaction Records Found</span>
            </div>
          ) : (
            // 📱 min-w-[800px] নিশ্চিত করবে মোবাইলে কলামগুলো জ্যাম না হয়ে নিজস্ব স্পেস বজায় রাখবে
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                  <th className="pb-5 pl-2 font-black">TRANSACTION ID</th>
                  <th className="pb-5 font-black">USER</th>
                  <th className="pb-5 font-black">LIBRARIAN</th>
                  <th className="pb-5 font-black">BOOK</th>
                  <th className="pb-5 font-black text-amber-500">AMOUNT</th>
                  <th className="pb-5 font-black">DATE</th>
                  <th className="pb-5 pr-2 font-black text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40 text-zinc-300">
                <AnimatePresence>
                  {transactions.map((item) => (
                    <motion.tr 
                      key={item._id?.oid || item._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-950/50 h-24 transition-colors duration-150 align-middle"
                    >
                      {/* 🆔 ট্রানজেকশন আইডি */}
                      <td className="py-6 pl-2 font-mono text-zinc-400 font-semibold tracking-tight break-all max-w-[140px]">
                        {item.transactionId || "N/A"}
                      </td>

                      {/* 👤 ইউজার */}
                      <td className="py-6 font-sans max-w-[150px] truncate">
                        <div className="font-bold text-white text-xs capitalize tracking-wide truncate">{item.userName}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 font-medium font-sans lowercase truncate">{item.userEmail}</div>
                      </td>

                      {/* 👤 লাইব্রেরিয়ান */}
                      <td className="py-6 font-sans max-w-[150px] truncate">
                        <div className="font-bold text-zinc-300 text-xs capitalize tracking-wide truncate">James Rodriguez</div>
                        <div className="text-[10px] text-zinc-500 mt-1 font-medium font-sans truncate">{item.librarianEmail || "james@heritagebooks.com"}</div>
                      </td>

                      {/* 📚 বইয়ের টাইটেল */}
                      <td className="py-6 font-semibold text-zinc-200 capitalize max-w-[160px] truncate">
                        {item.title}
                      </td>

                      {/* 💰 টোটাল অ্যামাউন্ট লজিক (price + fee) */}
                      <td className="py-6 text-amber-500 font-extrabold text-xs">
                        ${(Number(item.price || 0) + Number(item.fee || 0)).toFixed(2)}
                      </td>

                      {/* 📅 তারিখ কলাম */}
                      <td className="py-6 text-zinc-400 font-medium font-sans">
                        {formatDate(item.requestedAt)}
                      </td>

                      {/* 🏷️ ডাইনামিক স্ট্যাটাস পিল */}
                      <td className="py-6 pr-2 text-right">
                        <span className={`px-2.5 py-1 border font-bold rounded-md text-[9px] uppercase tracking-wide inline-flex items-center gap-1.5 ${statusColors[item.deliveryStatus || "Pending"]}`}>
                          {item.deliveryStatus === "Pending" && (
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-ping" />
                          )}
                          {item.deliveryStatus || "Pending"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}