"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  FiLayout, FiTruck, FiBookOpen, FiStar, 
  FiHeart, FiUser, FiShield 
} from "react-icons/fi";

export default function UserLayout({ children }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user?.role || session?.user?.metadata?.role || "user";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  // 🔒 লোডিং এবং মাউন্ট গেটওয়ে ভ্যালিডেশন
  if (isPending || !isMounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-sans">
        <p className="animate-pulse tracking-widest text-sm">LOADING USER REPOSITORY...</p>
      </div>
    );
  }

  // অ্যাক্সেস কন্ট্রোল
  if (userRole !== "user" && userRole !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 mb-4">
          <FiShield size={40} />
        </div>
        <h1 className="text-2xl font-black text-white">403 - Access Denied</h1>
        <p className="text-zinc-400 text-sm mt-2">Please login with a User account to view this space.</p>
        <Link href="/login" className="mt-6 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">
          Go to Login
        </Link>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", href: "/dashboard/user", icon: <FiLayout size={16} /> },
    { name: "Delivery History", href: "/dashboard/user/history", icon: <FiTruck size={16} /> },
    { name: "Reading List", href: "/dashboard/user/reading-list", icon: <FiBookOpen size={16} /> },
    { name: "My Reviews", href: "/dashboard/user/reviews", icon: <FiStar size={16} /> },
    { name: "Wishlist", href: "/dashboard/user/wishlist", icon: <FiHeart size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 flex font-sans overflow-hidden">
      
      {/* 🧭 বাম পাশের ইউজার সাইডবার */}
      <aside className="w-64 bg-zinc-900/30 border-r border-zinc-800/60 p-5 flex flex-col gap-6 hidden lg:flex flex-shrink-0 min-h-screen sticky top-0">
        
        {/* ইউজার প্রোফাইল কার্ড উইজেট */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3 text-zinc-400 shadow-inner overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
              <FiUser size={28} />
            )}
          </div>
          <h2 className="text-sm font-bold text-white truncate max-w-full capitalize">
            {session?.user?.name || "Dominique Shepard"}
          </h2>
          <p className="text-[11px] text-zinc-500 truncate max-w-full mt-0.5">
            {session?.user?.email || "user@example.com"}
          </p>
          <span className="mt-3 px-4 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-full capitalize">
            {userRole}
          </span>
        </div>

        {/* সাইডবার লিঙ্কের তালিকা */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="block">
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm" 
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                }`}>
                  {item.icon} {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 🖥️ ডানপাশের ডাইনামিক কন্টেন্ট এরিয়া */}
      {/* 🟢 ফিক্সড: children লুপের বাইরে একদম সেফলি রেন্ডার হচ্ছে ভাই */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full h-screen">
        {children}
      </main>

    </div>
  );
}