"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  FiLayout, FiCheckSquare, FiUsers, FiBook, 
  FiDollarSign, FiShield 
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user?.role || session?.user?.metadata?.role || "user";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // 🔒 সিকিউরিটি এবং লোডিং গেটওয়ে
  if (isPending || !isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-sans">
        <p className="animate-pulse tracking-widest text-sm font-bold">LOADING ADMIN CORE...</p>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="p-4 bg-red-50 border border-red-100 rounded-full text-red-500 mb-4 shadow-sm">
          <FiShield size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">403 - Access Denied</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">You do not have clearance to view Admin Core.</p>
        <Link href="/" className="mt-6 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-indigo-700 transition-all">
          Back to Safety
        </Link>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <FiLayout size={16} /> },
    { name: "Book Approvals", href: "/dashboard/admin/approvals", icon: <FiCheckSquare size={16} /> },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: <FiUsers size={16} /> },
    { name: "Manage Books", href: "/dashboard/admin/books", icon: <FiBook size={16} /> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <FiDollarSign size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans relative">

      {/* 📱 ১. আপনার পছন্দের প্রিমিয়াম ডার্ক মোবাইল নেভিগেশন বার (md স্ক্রিনের নিচে দেখাবে ভাই) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-2xl md:hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href} className="flex-1 max-w-[80px] group cursor-pointer">
              <span className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-all duration-200 ${
                isActive ? "text-white scale-105" : "text-zinc-400 hover:text-zinc-200"
              }`}>
                
                {/* একটিভ আইকন হাইলাইটার */}
                <span className={`transition-transform duration-200 ${
                  isActive ? "text-indigo-400 scale-110" : "text-zinc-400 group-hover:scale-105"
                }`}>
                  {item.icon}
                </span>
                
                <span className="truncate max-w-full">{item.name.split(" ")[0]}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 🖥️ ২. ডেস্কটপ ও ট্যাবলেট সাইডবার (md স্ক্রিন থেকে ভিজিবল হবে) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col gap-6 hidden md:flex flex-shrink-0 h-screen sticky top-0 shadow-sm">
        
        {/* এডমিন প্রোফাইল কার্ড উইজেট */}
        <div className="bg-black border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 text-slate-400 shadow-sm overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <FiUsers size={28} className="text-slate-400" />
            )}
          </div>
          <h2 className="text-sm font-black text-white truncate max-w-full capitalize">
            {session?.user?.name || "Admin Core"}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium truncate max-w-full mt-0.5">
            {session?.user?.email || "admin@core.com"}
          </p>
          <span className="mt-3 px-4 py-0.5 bg-indigo-50 border border-indigo-100 text-gray-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* সাইডবার মেনু লিংকসমূহ */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="block">
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-black text-white font-bold shadow-md shadow-slate-900/10" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                  {item.icon} {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 🖥️ ৩. মেইন ডাইনামিক কন্টেন্ট এরিয়া */}
      {/* মোবাইলের বটম বারের সিকিউরিটির জন্য pb-24 এবং ডেস্কটপে সাধারণ প্যাডিং রাখা হয়েছে */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full min-h-screen pb-24 md:pb-8 bg-slate-50">
        {children}
      </main>

    </div>
  );
}