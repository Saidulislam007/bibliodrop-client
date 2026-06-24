"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";
import { authClient } from "@/lib/auth-client"; 
import ListedBooksCard from "../_components/librarian/ListedBooksCard";
import TotalEarningsCard from "../_components/librarian/TotalEarningsCard";
import PendingRequestsCard from "../_components/librarian/PendingRequestsCard";
import CategoryPieChart from "../_components/librarian/CategoryPieChart";

// 🟢 কাস্টম মডুলার কম্পোনেন্টসমূহ ইম্পোর্ট করা হলো ভাই


export default function LibrarianOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  // 🔒 সেফটি চেক লোডার
  if (sessionLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>SYNCHRONIZING LIBRARIAN METRICS...</span>
      </div>
    );
  }

  // 💡 মঙ্গোডিবি থেকে লাইভ ডাটা আসার পর এই ভ্যালুগুলো প্রপ্স আকারে ডাইনামিক পাস করবেন ভাই
  const mockListedCount = 2;
  const mockEarnings = 58.00;
  const mockPendingCount = 0;
  
  const mockPieData = [
    { name: "Romance", value: 50 },
    { name: "History", value: 50 },
  ];

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* হেডার ব্লক */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Overview, <span className="capitalize text-indigo-600">{session?.user?.name || "Librarian"}</span>!
        </h1>
        <p className="text-xs text-zinc-600 mt-0.5">Manage your books and track earnings.</p>
      </div>

      {/* 🚀 ৪. আলাদা আলাদা ৩টি স্ট্যাটস কার্ড রেন্ডার করা হলো ভাই */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <ListedBooksCard value={mockListedCount} />
        <TotalEarningsCard value={mockEarnings} />
        <PendingRequestsCard value={mockPendingCount} />
      </div>

      {/* 🚀 ৫. আলাদা পাই চার্ট কম্পোনেন্ট রেন্ডার করা হলো ভাই */}
      <CategoryPieChart data={mockPieData} />
    </div>
  );
}