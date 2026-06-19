"use client";

import React from "react";
import { FiBookOpen, FiClock, FiDollarSign } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UserOverview() {
  const stats = [
    { id: 1, name: "Total Books Read", value: "18 Books", icon: <FiBookOpen size={20} />, color: "bg-blue-500/10 text-blue-400" },
    { id: 2, name: "Pending Deliveries", value: "2 Orders", icon: <FiClock size={20} />, color: "from-amber-500/10 text-amber-400" },
    { id: 3, name: "Total Spent on Fees", value: "$42.50", icon: <FiDollarSign size={20} />, color: "from-emerald-500/10 text-emerald-400" },
  ];

  const readingActivityData = [
    { name: "Jan", books: 2 }, { name: "Feb", books: 4 },
    { name: "Mar", books: 1 }, { name: "Apr", books: 5 },
    { name: "May", books: 3 }, { name: "Jun", books: 3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back!</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Here is your local library reading summary.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.color} bg-zinc-800/40`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-lg font-black text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* চার্ট কন্টেইনার */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Your Monthly Reading Activity</h3>
        <div className="w-full h-64 text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={readingActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222" }} />
              <Bar dataKey="books" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Books Read" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}