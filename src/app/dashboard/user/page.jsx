"use client";

import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

// 🟢 আপনার মডুলার আর্কিটেকচার অনুযায়ী সব চাইল্ড ফাইল ইম্পোর্ট করা হলো ভাই
import TotalBooksCard from "@/app/dashboard/_components/user/TotalBooksCard";
import PendingDeliveriesCard from "@/app/dashboard/_components/user/PendingDeliveriesCard";
import TotalSpentCard from "@/app/dashboard/_components/user/TotalSpentCard";
import ReadingChart from "@/app/dashboard/_components/user/ReadingChart";

// 🔍 এপিআই মেথড ইম্পোর্ট
import { getDeliveriesByEmail } from "@/lib/api/books";

export default function UserOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // ডাইনামিক ডাটা স্টেট সমূহ ভাই
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সেশন লোড হতে থাকলে বা ইউজার সেশন অবজেক্ট না থাকলে ফেচ ব্লক স্কিপ করবে ভাই
    if (sessionLoading) return;
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const fetchUserSummaryData = async () => {
      try {
        setLoading(true);
        const currentUserId = session.user.id || session.user._id;

        // ১. ইউজারের ইমেইল দিয়ে ডাটাবেজ থেকে সমস্ত ডেলিভারি ডাটা লোড করা হলো ভাই
        const data = await getDeliveriesByEmail(session.user.email);
        
        if (Array.isArray(data)) {
          // ২. [🧠 স্ট্রং সিকিউরিটি ফিল্টার] কারেন্ট লগইন ইউজারের ডাটা আলাদা করা হলো
          const userDeliveries = data.filter(
            (item) => item.userEmail === session.user.email && item.userId === currentUserId
          );

          // 🎯 ৩. আপনার রিকোয়ার্ড স্পেসিফিক ফিল্টার: শুধুমাত্র "Delivered" হওয়া ডাটার সংখ্যা
          const deliveredItems = userDeliveries.filter(item => item.deliveryStatus === "Delivered");
          
          // ⏳ ৪. পেন্ডিং রিকোয়েস্ট কাউন্ট
          const pendingItems = userDeliveries.filter(item => item.deliveryStatus === "Pending");
          
          // 💰 🟢 ৫. নতুন ইমপ্লিমেন্টেড লজিক: শুধুমাত্র Delivered হওয়া বইয়ের Fee + Price এর যোগফল ভাই
          const spent = deliveredItems.reduce((acc, item) => {
            const itemFee = Number(item.fee) || 0;
            const itemPrice = Number(item.price) || 0;
            return acc + itemFee + itemPrice;
          }, 0);

          // 📊 ৬. চার্টের জন্য মাস ভিত্তিক অবজেক্ট ডেটা প্রিপারেশন লজিক
          const monthlyData = {};
          deliveredItems.forEach(item => {
            if (item.requestedAt) {
              const month = new Date(item.requestedAt).toLocaleString('en-US', { month: 'short' });
              monthlyData[month] = (monthlyData[month] || 0) + 1;
            }
          });

          // Recharts এর ফরম্যাটে ম্যাপ করা হলো ভাই
          const formattedChartData = Object.keys(monthlyData).map(month => ({
            name: month,
            books: monthlyData[month]
          }));

          // 🎯 সব স্টেট একসাথে সিঙ্গেল ট্রিক্সে ক্লিন আপডেট করা হলো ভাই
          setDeliveredCount(deliveredItems.length);
          setPendingCount(pendingItems.length);
          setTotalSpent(spent);
          setChartData(formattedChartData);
        }
      } catch (err) {
        console.error("Error generating user summary assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSummaryData();
  }, [session?.user?.email, sessionLoading]); // 🟢 ফিক্সড: স্ট্রিং ভ্যালু ডিপেন্ডেন্সি ট্র্যাকিং লুপ ব্রেক করবে

  // ১. লোডিং অবস্থা হ্যান্ডলার
  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>COMPILING USER INTERFACE METRICS...</span>
      </div>
    );
  }

  // ২. ইউজার লগইন না থাকলে প্রোটেকশন
  if (!session?.user) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center text-rose-400 font-bold text-xs">
        🔒 Access Denied. Active session payload required.
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* হেডার ব্লক - ফাইলে কেবল একবারই থাকবে ভাই */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Welcome Back, <span className="capitalize text-indigo-400">{session.user.name || "Reader"}</span>!
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">Here is your local library reading summary.</p>
      </div>

      {/* 📦 ৩টি আলাদা ডেডিকেটেড কম্পোনেন্টে ডাইনামিক স্টেট ডাটা পাস করা হলো ভাই */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <TotalBooksCard value={`${deliveredCount} Books`} />
        <PendingDeliveriesCard value={`${pendingCount} Orders`} />
        <TotalSpentCard value={totalSpent.toFixed(2)} />
      </div>

      {/* 📊 ডাইনামিক চার্ট কন্টেইনার কম্পোনেন্ট */}
      <ReadingChart data={chartData} />
    </div>
  );
}