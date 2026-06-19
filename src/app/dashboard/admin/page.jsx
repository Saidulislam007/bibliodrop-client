"use client";

import React from "react";
import { FiUsers, FiBook, FiTruck, FiDollarSign } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function OverviewPage() {
  const stats = [
    { id: 1, name: "Total Users", value: "1,248", icon: <FiUsers size={22} />, color: "from-blue-500 to-indigo-600" },
    { id: 2, name: "Total Books", value: "4,850", icon: <FiBook size={22} />, color: "from-emerald-500 to-teal-600" },
    { id: 3, name: "Total Deliveries", value: "892", icon: <FiTruck size={22} />, color: "from-amber-500 to-orange-600" },
    { id: 4, name: "Total Revenue", value: "$12,450", icon: <FiDollarSign size={22} />, color: "from-rose-500 to-pink-600" },
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
    { name: "History", value: 400 }, { name: "Romance", value: 300 },
    { name: "Mystery", value: 300 }, { name: "Sci-Fi", value: 200 },
    { name: "Academic", value: 278 },
  ];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Real-time analytical metrics core engine.</p>
      </div>

      {/* কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between shadow-md">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* গ্রাফসমূহ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Revenue Trends</h3>
          <div className="w-full h-72 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222" }} />
                <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Category Ratio</h3>
          <div className="w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((e, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400 px-2">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}