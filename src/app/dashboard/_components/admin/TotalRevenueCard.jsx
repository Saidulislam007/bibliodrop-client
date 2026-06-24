"use client";

import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { FiDollarSign } from "react-icons/fi";
// 🟢 ডেটাবেজ থেকে ডেলিভারির লিস্ট নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই
import { getDeliveriesByEmail } from "@/lib/api/books"; 

export default function TotalRevenueCard({ value: initialValue = "$12,450" }) {
  // 🔄 টোটাল রেভিনিউ অ্যামাউন্ট ট্র্যাক করার জন্য লোকাল স্টেট ভাই
  const [totalRevenue, setTotalRevenue] = useState(initialValue);

  useEffect(() => {
    const calculateRevenue = async () => {
      try {
        // এপিআই কল করে সমস্ত ডেলিভারি ডেটা নিয়ে আসা হলো ভাই
        const data = await getDeliveriesByEmail(""); 
        
        let deliveriesArray = [];
        if (Array.isArray(data)) {
          deliveriesArray = data;
        } else if (data && Array.isArray(data.deliveries)) {
          deliveriesArray = data.deliveries;
        }

        // 🎯 ১. ফিল্টারিং: শুধুমাত্র "deliveryStatus" === "Delivered" অবজেক্টগুলো আলাদা করা হলো
        const deliveredItems = deliveriesArray.filter(
          (item) => item.deliveryStatus === "Delivered"
        );

        // 🎯 ২. যোগফল (Sum): ফিল্টার করা ডেলিভারিগুলোর "price" যোগ করা হলো ভাই
        const totalSum = deliveredItems.reduce((sum, item) => {
          const itemPrice = parseFloat(item.price) || 0;
          return sum + itemPrice;
        }, 0);

        // 🎯 ৩. ফরম্যাটিং: যোগফলকে প্রফেশনাল কারেন্সি স্টাইলে ($304.50 বা $12,450) কনভার্ট করা হলো ভাই
        const formattedRevenue = `$${totalSum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        // লোকাল স্টেট আপডেট লক করা হলো ভাই
        setTotalRevenue(formattedRevenue);

      } catch (error) {
        console.error("Error calculating total revenue inside card node:", error);
      }
    };

    calculateRevenue();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between shadow-md">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Revenue</p>
        {/* 🎯 ডেটাবেজের রিয়াল-টাইম সাকসেসফুলি Delivered হওয়া সব বইয়ের প্রাইসের মোট যোগফল এখানে বসবে ভাই */}
        <p className="text-xl font-black text-white">{totalRevenue}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white">
        <FiDollarSign size={22} />
      </div>
    </div>
  );
}