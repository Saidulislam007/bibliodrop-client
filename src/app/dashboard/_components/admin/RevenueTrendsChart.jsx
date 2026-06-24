"use client";

import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// 🟢 ডেটাবেজ থেকে ডেলিভারির লিস্ট নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই
import { getDeliveriesByEmail } from "@/lib/api/books"; 

export default function RevenueTrendsChart() {
  // 🔄 ডাইনামিক চার্ট ডাটা ম্যাপ করার লোকাল স্টেট ভাই
  const [chartData, setChartData] = useState([
    { name: "Jan", Revenue: 0, Deliveries: 0 },
    { name: "Feb", Revenue: 0, Deliveries: 0 },
    { name: "Mar", Revenue: 0, Deliveries: 0 },
    { name: "Apr", Revenue: 0, Deliveries: 0 },
    { name: "May", Revenue: 0, Deliveries: 0 },
    { name: "Jun", Revenue: 0, Deliveries: 0 },
    { name: "Jul", Revenue: 0, Deliveries: 0 },
    { name: "Aug", Revenue: 0, Deliveries: 0 },
    { name: "Sep", Revenue: 0, Deliveries: 0 },
    { name: "Oct", Revenue: 0, Deliveries: 0 },
    { name: "Nov", Revenue: 0, Deliveries: 0 },
    { name: "Dec", Revenue: 0, Deliveries: 0 },
  ]);

  useEffect(() => {
    const processChartData = async () => {
      try {
        // এপিআই কল করে সমস্ত ডাটা নিয়ে আসা হলো ভাই
        const data = await getDeliveriesByEmail(""); 
        
        let deliveriesArray = [];
        if (Array.isArray(data)) {
          deliveriesArray = data;
        } else if (data && Array.isArray(data.deliveries)) {
          deliveriesArray = data.deliveries;
        }

        // 🎯 ১. ফিল্টারিং: শুধুমাত্র "deliveryStatus" === "Delivered" ডাটা আলাদা করা হলো ভাই
        const deliveredOnly = deliveriesArray.filter(
          (item) => item.deliveryStatus === "Delivered"
        );

        // মাসের নাম ইনডেক্স অনুযায়ী ম্যাপিং অবজেক্ট ভাই
        const monthMap = {
          0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
          6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"
        };

        // নতুন ফ্রেস কাউন্টার স্ট্রাকচার ডিক্লেয়ার ভাই
        const initialMonths = Object.keys(monthMap).reduce((acc, key) => {
          acc[monthMap[key]] = { Revenue: 0, Deliveries: 0 };
          return acc;
        }, {});

        // 🎯 ২. ক্যালকুলেশন লুপ: "requestedAt" এর ডেট থেকে মাস বের করে সাম (Sum) করা হলো ভাই
        deliveredOnly.forEach((item) => {
          if (!item.requestedAt) return;
          
          const date = new Date(item.requestedAt);
          const monthName = monthMap[date.getMonth()]; // ০ থেকে ১১ ইনডেক্স রিটার্ন করবে ভাই
          
          if (monthName && initialMonths[monthName]) {
            const itemPrice = parseFloat(item.price) || 0;
            initialMonths[monthName].Revenue += itemPrice;
            initialMonths[monthName].Deliveries += 1;
          }
        });

        // 🎯 ৩. রিচার্টস (Recharts) ফ্রেন্ডলি ফরম্যাটে কনভার্ট করা হলো ভাই
        const formattedChartData = Object.keys(initialMonths).map((month) => ({
          name: month,
          Revenue: initialMonths[month].Revenue,
          Deliveries: initialMonths[month].Deliveries,
        }));

        // লোকাল চার্ট স্টেট আপডেট লক ভাই
        setChartData(formattedChartData);

      } catch (error) {
        console.error("Error formatting revenue trends chart data:", error);
      }
    };

    processChartData();
  }, []);

  return (
    <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Revenue Trends</h3>
      <div className="w-full h-72 text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222" }} />
            <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}