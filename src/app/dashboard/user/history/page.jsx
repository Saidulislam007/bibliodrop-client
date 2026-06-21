"use client";

import React, { useState, useEffect } from "react";
import { FiLoader, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

// 🟢 আপনার তৈরি করা পাথমতো এপিআই ফাইল থেকে মেথডটি ইম্পোর্ট করা হলো ভাই
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function DeliveryHistory() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক স্টেট সমূহ
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // আপনার UI থিমের সাথে মিলিয়ে ডাইনামিক স্ট্যাটাস কালার অবজেক্ট ভাই
  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  useEffect(() => {
    const loadDeliveryHistory = async () => {
      // সেশন লোড হওয়া শেষ এবং ইউজার যদি লগইন না থাকে
      if (!sessionLoading && !session?.user) {
        setLoading(false);
        return;
      }

      if (session?.user?.email) {
        try {
          setLoading(true);
          // ১. ইউজারের ইমেইল দিয়ে ডাটাবেজ থেকে ডেলিভারি হিস্ট্রি তুলে আনা হচ্ছে
          const data = await getDeliveriesByEmail(session.user.email);
          
          // ২. [🧠 স্ট্রং সিকিউরিটি ফিল্টার] ডাটাবেজের userId এবং userEmail কারেন্ট সেশনের সাথে ম্যাচ করানো হলো ভাই
          const currentUserId = session.user.id || session.user._id;
          const filteredData = Array.isArray(data) ? data.filter(
            (item) => item.userEmail === session.user.email && item.userId === currentUserId
          ) : [];

          // ৩. নতুন রিকোয়েস্টগুলো যাতে সবার ওপরে থাকে তার জন্য সর্টিং লজিক (Optional)
          filteredData.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

          setDeliveries(filteredData);
        } catch (err) {
          console.error("Error synchronizing delivery history core node:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDeliveryHistory();
  }, [session, sessionLoading]);

  // ডেট ফরম্যাট করার হেল্পার ফাংশন ভাই
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // ১. সেশন বা ডাটাবেজ লোডিং অবস্থা
  if (sessionLoading || loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={18} />
        <span>FETCHING USER DELIVERY HISTORIES...</span>
      </div>
    );
  }

  // ২. ইউজার লগইন না থাকলে প্রোটেকশন মেসেজ
  if (!session?.user) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center text-rose-400 font-bold text-xs tracking-wide">
        🔒 Access Denied. Token Required to Read Delivery Pipeline.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Delivery History</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Track your past and active book drop deliveries.</p>
      </div>

      {/* ৩. ডাটাবেজে কোনো ডেলিভারি ডাটা না থাকলে এম্পটি স্টেট দেখাবে */}
      {deliveries.length === 0 ? (
        <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-500 font-medium text-xs sm:text-sm">
            Your delivery registry pipeline is empty. No active or past drops found.
          </p>
        </div>
      ) : (
        /* ৪. ডাইনামিক ডেটাসহ আপনার পিওর রেসপনসিভ টেবিল */
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Book Title</th>
                  <th className="pb-3">Delivery Fee</th>
                  <th className="pb-3">Request Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {deliveries.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-800/10 transition-colors">
                    {/* বুক কভার ইমেজ এবং টাইটেল একসাথে দেখতে সুন্দর লাগবে ভাই */}
                    <td className="py-3.5 font-bold text-white flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-7 h-9 object-cover rounded bg-zinc-950 border border-zinc-800/80" 
                      />
                      <span className="capitalize truncate max-w-[200px] sm:max-w-xs">{item.title}</span>
                    </td>
                    
                    {/* ডেলিভারি ফি ম্যাপ */}
                    <td className="py-3.5 text-zinc-400 font-semibold">
                      ${item.fee?.toFixed(2) || "0.00"}
                    </td>
                    
                    {/* রিকোয়েস্ট এর তারিখ */}
                    <td className="py-3.5 text-zinc-500">
                      {formatDate(item.requestedAt)}
                    </td>
                    
                    {/* ডাইনামিক স্ট্যাটাস কালার লজিক */}
                    <td className="py-3.5 text-right">
                      <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide inline-flex items-center gap-1 ${statusColors[item.deliveryStatus || "Pending"]}`}>
                        {item.deliveryStatus === "Pending" && <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />}
                        {item.deliveryStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}