"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiLayout, FiTruck, FiBookOpen, FiStar,
  FiHeart, FiUser, FiShield, FiMenu, FiX
} from "react-icons/fi";

export default function UserLayout({ children }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user?.role || session?.user?.metadata?.role || "user";

  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🟢 মোবাইল মেনু স্টেট ভাই

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // পেজ চেঞ্জ হলে মোবাইল ড্রপডাউন মেনু অটোমেটিক বন্ধ হবে ভাই
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 🔒 লোডিং গেটওয়ে
  if (isPending || !isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-sans">
        <p className="animate-pulse tracking-widest text-sm font-bold">LOADING USER REPOSITORY...</p>
      </div>
    );
  }

  // অ্যাক্সেস কন্ট্রোল
  if (userRole !== "user" && userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-full text-rose-500 mb-4 shadow-sm">
          <FiShield size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">403 - Access Denied</h1>
        <p className="text-slate-500 text-sm mt-2">Please login with a User account to view this space.</p>
        <Link href="/login" className="mt-6 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-indigo-700 transition-all">
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative">

      {/* 📱 ১. রেস্পনসিভ টপ হেডার বার (যা আপনার স্ক্রিনশটের মতো উপরে ফিক্সড থাকবে ভাই) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between z-50 md:hidden shadow-md">
        <div className="flex items-center gap-2">
          {/* আপনার লোগো আইকন */}
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <span className="text-white font-black tracking-tight text-base">BiblioDrop</span>
        </div>

        {/* 🍔 হামবার্গার বা ক্লোজ বাটন টগল */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </header>

      {/* 📱 ২. মোবাইল টপ ড্রপডাউন মেনু (ক্লিক করলে স্মুথলি নিচ দিয়ে নেমে আসবে ভাই) */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-40 md:hidden p-4 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className="block">
                  <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}>
                    {item.icon} {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {/* ইউজার ডেমোগ্রাফিক ইনফো ড্রপডাউনের নিচে */}
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser size={16} className="text-zinc-500 m-auto mt-1.5" />
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{session?.user?.name || "Saidul Islam"}</p>
              <p className="text-[10px] text-zinc-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row relative w-full">

        {/* 🖥️ ৩. ডেস্কটপ ও ট্যাবলেট সাইডবার (md স্ক্রিন থেকে দেখাবে, মোবাইলে হাইড) */}
        <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col gap-6 hidden md:flex flex-shrink-0 h-screen sticky top-0 shadow-sm">
          {/* প্রোফাইল কার্ড */}
          <div className="bg-black border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-inner">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 text-slate-400 shadow-sm overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser size={28} className="text-slate-400" />
              )}
            </div>
            <h2 className="text-sm font-black text-white truncate max-w-full capitalize">
              {session?.user?.name || "Saidul Islam"}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-full mt-0.5">
              {session?.user?.email || "user@example.com"}
            </p>
            <span className="mt-3 px-4 py-0.5 bg-indigo-50 border border-indigo-100 text-gray-600 text-[10px] font-extrabold rounded-full capitalize">
              {userRole}
            </span>
          </div>

          {/* ডেস্কটপ সাইডবার লিঙ্ক */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className="block">
                  <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? "bg-black text-white font-bold shadow-md shadow-indigo-600/10"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}>
                    {item.icon} {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 🖥️ ৪. ডাইনামিক কন্টেন্ট এরিয়া */}
        {/* 🟢 ফিক্সড: pt-16 এবং pb-24 দিয়ে কন্টেন্টকে মোবাইল হেডার ও ফিক্সড বটম বারের মাঝখানে নিখুঁত করা হলো */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full min-h-screen pt-20 md:pt-8 pb-24 md:pb-8 bg-slate-50">
          {children}
        </main>

      </div>

      {/* 📱 ৫. মোবাইল ডিভাইসের জন্য নিচের প্রিমিয়াম বটম বার */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl md:hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex-1 max-w-[75px] group">
              <span className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-all duration-200 ${
                isActive ? "text-black scale-105" : "text-slate-400 hover:text-slate-900"
              }`}>
                <span className={`transition-transform duration-200 ${isActive ? "text-black scale-110" : "text-slate-400 group-hover:scale-105"}`}>
                  {item.icon}
                </span>
                <span className="truncate max-w-full text-[9px] sm:text-[10px]">{item.name.split(" ")[0]}</span>
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}