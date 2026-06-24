"use client";

import React, { useState, useEffect } from "react"; // 🟢 স্টেট এবং ইফেক্ট হুক ইম্পোর্ট ভাই
import { FiUsers } from "react-icons/fi";
// 🟢 ডেটাবেজ থেকে ইউজার নিয়ে আসার কোর এপিআই ফাংশন ইম্পোর্ট ভাই
import { getUsers } from "@/lib/api/users"; 

export default function TotalUsersCard({ value: initialValue = "1,248" }) {
  // 🔄 ইউজার কাউন্ট ট্র্যাক করার জন্য স্টেট ভাই
  const [userCount, setUserCount] = useState(initialValue);

  useEffect(() => {
    const fetchUserLength = async () => {
      try {
        const data = await getUsers();
        
        // ডেটা যদি সরাসরি অ্যারে হয় অথবা অবজেক্টের ভেতর ইউজার্স অ্যারে থাকে, তা সিঙ্ক করা হলো ভাই
        if (Array.isArray(data)) {
          setUserCount(data.length.toLocaleString());
        } else if (data && Array.isArray(data.users)) {
          setUserCount(data.users.length.toLocaleString());
        } else if (data && typeof data.total === "number") {
          setUserCount(data.total.toLocaleString());
        }
      } catch (error) {
        console.error("Error loading user length inside card node:", error);
      }
    };

    fetchUserLength();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between shadow-md">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Users</p>
        {/* 🎯 এখানে ডাইনামিকালি ইউজার লেংথ বসে যাবে ভাই */}
        <p className="text-xl font-black text-white">{userCount}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <FiUsers size={22} />
      </div>
    </div>
  );
}