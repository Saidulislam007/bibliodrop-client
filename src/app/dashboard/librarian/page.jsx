"use client";

import React from "react";
import { FiBookOpen, FiDollarSign, FiClock } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function LibrarianOverview() {
  const stats = [
    { id: 1, name: "Total Books Listed", value: "2", icon: <FiBookOpen size={20} />, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { id: 2, name: "Total Earnings", value: "$58.00", icon: <FiDollarSign size={20} />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { id: 3, name: "Pending Requests", value: "0", icon: <FiClock size={20} />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ];

  const pieData = [
    { name: "Romance", value: 50 },
    { name: "History", value: 50 },
  ];
  
  const COLORS = ["#4f46e5", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Overview</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Manage your books and track earnings.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.color} border`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Books by Category Pie Chart */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 max-w-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Books by Category</h3>
        <div className="w-full h-56 flex items-center justify-center text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Requested Books */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 max-w-xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Most Requested Books</h3>
        <div className="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">1</span>
            <p className="text-xs font-bold text-white">Quia sunt eum incidu</p>
          </div>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 border border-indigo-500/20 rounded-md">1 Requests</span>
        </div>
      </div>
    </div>
  );
}