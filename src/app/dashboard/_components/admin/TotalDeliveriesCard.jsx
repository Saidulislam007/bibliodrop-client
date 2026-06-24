"use client";

import { getDeliveriesByEmail } from "@/lib/api/books";
import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { FiTruck } from "react-icons/fi";
// 🟢 ডেটাবেজ থেকে ডেলিভারির লিস্ট নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই


export default function TotalDeliveriesCard({ value: initialValue = "892" }) {
  // 🔄 ডেলিভারির টোটাল কাউন্ট ট্র্যাক করার জন্য লোকাল স্টেট ভাই
  const [deliveriesCount, setDeliveriesCount] = useState(initialValue);

  useEffect(() => {
    const fetchDeliveriesLength = async () => {
      try {
        // এপিআই কল করে সমস্ত ডাটা নিয়ে আসা হলো ভাই
        const data = await getDeliveriesByEmail(""); 
        
        let deliveriesArray = [];
        if (Array.isArray(data)) {
          deliveriesArray = data;
        } else if (data && Array.isArray(data.deliveries)) {
          deliveriesArray = data.deliveries;
        }

        // 🎯 ফিল্টারিং মেকানিজম: কোনো ইমেইল লজিক ছাড়া শুধুমাত্র "deliveryStatus" === "Delivered" ম্যাচ করা হলো ভাই
        const deliveredOnly = deliveriesArray.filter(
          (item) => item.deliveryStatus === "Delivered"
        );

        // রিয়াল-টাইম লেংথ স্টেট লক করা হলো ভাই
        setDeliveriesCount(deliveredOnly.length.toLocaleString());

      } catch (error) {
        console.error("Error loading filtered deliveries count inside card node:", error);
      }
    };

    fetchDeliveriesLength();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between shadow-md">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Deliveries</p>
        {/* 🎯 ডেটাবেজের রিয়াল-টাইম শুধুমাত্র "Delivered" স্ট্যাটাসের মোট লেংথ এখানে বসবে ভাই */}
        <p className="text-xl font-black text-white">{deliveriesCount}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <FiTruck size={22} />
      </div>
    </div>
  );
}