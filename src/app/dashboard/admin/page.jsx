"use client";

import React from "react";
import TotalUsersCard from "../_components/admin/TotalUsersCard";
import TotalBooksCard from "../_components/admin/TotalBooksCard";
import TotalDeliveriesCard from "../_components/admin/TotalDeliveriesCard";
import TotalRevenueCard from "../_components/admin/TotalRevenueCard";
import RevenueTrendsChart from "../_components/admin/RevenueTrendsChart";
import CategoryRatioChart from "../_components/admin/CategoryRatioChart";
// 🟢 সবগুলো মডুলার সাব-কম্পোনেন্ট ইম্পোর্ট ভাই (পাথ আপনার ডিরেক্টরি অনুযায়ী সেট করবেন)


export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* হেডার নোড */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Real-time analytical metrics core engine.</p>
      </div>

      {/* গ্রিড প্যানেল: ৪টি অ্যানালিটিক্যাল স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TotalUsersCard value="1,248" />
        <TotalBooksCard value="4,850" />
        <TotalDeliveriesCard value="892" />
        <TotalRevenueCard value="$12,450" />
      </div>

      {/* গ্রাফ ও চার্ট ম্যাট্রিক্স লেয়ার */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RevenueTrendsChart />
        <CategoryRatioChart />
      </div>
    </div>
  );
}