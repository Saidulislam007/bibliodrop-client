"use client";

import React, { useState } from "react";
import Link from "next/link"; // ✅ এই ইম্পোর্টটি মিসিং ছিল, যা এখন যোগ করা হয়েছে
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { 
  FiUsers, FiBook, FiTruck, FiDollarSign, 
  FiCheck, FiTrash2, FiEyeOff, FiShield, FiAlertCircle 
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user?.role || session?.user?.metadata?.role || "reader";

  // নোটিফিকেশন স্টেট
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // 📊 ডামি ডাটা (চার্ট এবং ওভারভিউ এর জন্য)
  const stats = [
    { id: 1, name: "Total Users", value: "1,248", icon: <FiUsers size={24} />, color: "from-blue-500 to-indigo-600" },
    { id: 2, name: "Total Books", value: "4,850", icon: <FiBook size={24} />, color: "from-emerald-500 to-teal-600" },
    { id: 3, name: "Total Deliveries", value: "892", icon: <FiTruck size={24} />, color: "from-amber-500 to-orange-600" },
    { id: 4, name: "Total Revenue", value: "$12,450", icon: <FiDollarSign size={24} />, color: "from-rose-500 to-pink-600" },
  ];

  const barData = [
    { name: "Jan", Revenue: 4000, Deliveries: 240 },
    { name: "Feb", Revenue: 3000, Deliveries: 198 },
    { name: "Mar", Revenue: 2000, Deliveries: 300 },
    { name: "Apr", Revenue: 2780, Deliveries: 208 },
    { name: "May", Revenue: 1890, Deliveries: 150 },
    { name: "Jun", Revenue: 2390, Deliveries: 220 },
  ];

  const pieData = [
    { name: "History", value: 400 },
    { name: "Romance", value: 300 },
    { name: "Mystery", value: 300 },
    { name: "Sci-Fi", value: 200 },
    { name: "Academic", value: 278 },
  ];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

  // 🔒 সিকিউরিটি প্রোটেকশন চেক
  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-sans">
        <p className="animate-pulse tracking-widest text-sm">LOADING ADMIN CORE...</p>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <FiShield size={40} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">403 - Access Denied</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-sm leading-relaxed">
          You do not have the clearance level required to view the Admin Core Dashboard.
        </p>
        <Link href="/" className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md">
          Back to Safety
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* 🔔 custom TOAST */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none w-full max-w-sm">
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md pointer-events-auto ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {toast.type === "success" ? <FiCheck size={20} /> : <FiAlertCircle size={20} />}
              <p className="text-xs font-bold">{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Admin Core</h1>
          <p className="text-sm text-zinc-400 mt-1">Oversee users, approvals, transactions, and metrics system-wide.</p>
        </div>

        {/* ==================== ১. ওভারভিউ স্ট্যাটস কার্ডস ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ==================== ২. চার্টস ভিজ্যুয়ালাইজেশন ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* বার চার্ট */}
          <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Revenue & Performance</h3>
            <div className="w-full h-80 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Deliveries" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* পাই চার্ট */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Books by Category</h3>
            <div className="w-full h-64 flex items-center justify-center text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-zinc-400 px-2">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== ৩. বুক এপ্রুভাল কিউ (Queue) ==================== */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Book Approval Queue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Librarian</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3.5 font-semibold text-white">Voluptatibus dolor q</td>
                  <td className="py-3.5">Fuga Quaerat commod</td>
                  <td className="py-3.5"><span className="px-2 py-0.5 bg-zinc-800 rounded-md text-xs">History</span></td>
                  <td className="py-3.5 text-zinc-400">James Rodriguez</td>
                  <td className="py-3.5 text-right space-x-2">
                    <button onClick={() => showNotification("Book Approved & Published", "success")} className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all" title="Approve & Publish"><FiCheck size={14} /></button>
                    <button onClick={() => showNotification("Request Rejected", "error")} className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all" title="Delete listing"><FiTrash2 size={14} /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== ৪. ম্যানেজ ইউজার্স এবং ম্যানেজ অল বুকস ==================== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* ইউজার কন্ট্রোল প্যানেল */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-white">Sarah Mitchell</p>
                      <p className="text-[11px] text-zinc-500">sarah@example.com</p>
                    </td>
                    <td className="py-3"><span className="text-indigo-400 font-bold capitalize text-xs">Provider</span></td>
                    <td className="py-3 text-right space-x-1">
                      <button onClick={() => showNotification("Role upgraded to Admin", "success")} className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md font-bold text-[10px] transition-all">Make Admin</button>
                      <button onClick={() => showNotification("User deleted", "error")} className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md transition-all"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* অল বুকস কন্ট্রোল */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Manage All Books</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3">Book Info</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ultimate Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-white">The Silent Patient</p>
                      <p className="text-[11px] text-zinc-500">Alex Michaelides</p>
                    </td>
                    <td className="py-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded-md text-[10px]">Published</span></td>
                    <td className="py-3 text-right space-x-2">
                      <button onClick={() => showNotification("Book unpublished forcibly", "error")} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-md transition-all" title="Forcibly Unpublish"><FiEyeOff size={14} /></button>
                      <button onClick={() => showNotification("Book permanently deleted", "error")} className="p-1.5 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-md transition-all" title="Permanent Delete"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ==================== ৫. ট্রানজেকশন হিস্ট্রি ==================== */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">All Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Librarian</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 font-mono text-zinc-400 text-xs">tx_83928175402</td>
                  <td className="py-3">reader_boy@gmail.com</td>
                  <td className="py-3">sarah_mitchell@gmail.com</td>
                  <td className="py-3 font-bold text-emerald-400">$30.00</td>
                  <td className="py-3 text-right text-zinc-500 text-xs">Jun 20, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}