"use client";

import React, { useState, useEffect } from "react";
import { FiLoader, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 এপিআই মেথড ইম্পোর্ট
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function DeliveryHistory() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক স্টেট সমূহ
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাইনামিক স্ট্যাটাস কালার অবজেক্ট ভাই
  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  useEffect(() => {
    const loadDeliveryHistory = async () => {
      if (sessionLoading) return;
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDeliveriesByEmail(session.user.email);
        
        // সিকিউরিটি ফিল্টার ভাই
        const currentUserId = session.user.id || session.user._id;
        const filteredData = Array.isArray(data) ? data.filter(
          (item) => item.userEmail === session.user.email && item.userId === currentUserId
        ) : [];

        // শর্টিং লজিক
        filteredData.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

        setDeliveries(filteredData);
      } catch (err) {
        console.error("Error synchronizing delivery history core node:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryHistory();
  }, [session?.user?.email, sessionLoading]); // 🟢 ফিক্সড: স্ট্রিং ডিপেন্ডেন্সি ট্র্যাকিং

  // ডেট ফরম্যাট হেল্পার ভাই
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={18} />
        <span>FETCHING USER DELIVERY HISTORIES...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center text-rose-400 font-bold text-xs tracking-wide">
        🔒 Access Denied. Token Required to Read Delivery Pipeline.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* হেডার ব্লক - অ্যানিমেশন সহ */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delivery History</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Track your past and active book drop deliveries.</p>
      </motion.div>

      {/* ৩. ডেকোরেটেড এম্পটি স্টেট */}
      {deliveries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-10 text-center"
        >
          <p className="text-zinc-500 font-medium text-xs sm:text-sm">
            Your delivery registry pipeline is empty. No active or past drops found.
          </p>
        </motion.div>
      ) : (
        /* ৪. ডাইনামিক মোশন রেসপনসিভ টেবিল কন্টেইনার ভাই */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Book Title</th>
                  <th className="pb-3">Delivery Fee</th>
                  <th className="pb-3">Request Date</th>
                  <th className="pb-3 text-right">Transaction ID</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                <AnimatePresence>
                  {deliveries.map((item, index) => (
                    <motion.tr 
                      key={item._id} 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
                      className="hover:bg-zinc-800/20 transition-colors duration-150"
                    >
                      {/* বুক কভার ইমেজ এবং টাইটেল */}
                      <td className="py-3.5 font-bold text-white flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-7 h-9 object-cover rounded bg-zinc-950 border border-zinc-800/80" 
                        />
                        <span className="capitalize truncate max-w-[160px] sm:max-w-xs">{item.title}</span>
                      </td>
                      
                      {/* ডেলিভারি ফি */}
                      <td className="py-3.5 text-zinc-400 font-semibold">
                        ${item.fee?.toFixed(2) || "0.00"}
                      </td>
                      
                      {/* রিকোয়েস্ট এর তারিখ */}
                      <td className="py-3.5 text-zinc-500">
                        {formatDate(item.requestedAt)}
                      </td>

                      {/* ট্রানজেকশন আইডি ফিল্ড */}
                      <td className="py-3.5 text-right font-mono text-indigo-400 font-medium tracking-tight">
                        {item.transactionId || "N/A"}
                      </td>
                      
                      {/* ডাইনামিক স্ট্যাটাস কালার এবং ছোট অ্যানিমেটেড ডট */}
                      <td className="py-3.5 text-right">
                        <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide inline-flex items-center gap-1 ${statusColors[item.deliveryStatus || "Pending"]}`}>
                          {item.deliveryStatus === "Pending" && (
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                          )}
                          {item.deliveryStatus === "Dispatched" && (
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                          )}
                          {item.deliveryStatus || "Pending"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}