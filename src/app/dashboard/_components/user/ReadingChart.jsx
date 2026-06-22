import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiActivity } from "react-icons/fi";

export default function ReadingChart({ data }) {
  const [selectedYear, setSelectedYear] = useState("2026");

  // ডাটা ফাঁকা থাকলে সেফটি এম্পটি স্টেট চেক ভাই
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 shadow-sm space-y-4">
      
      {/* 🧭 চার্ট হেডার কন্ট্রোল ব্লক */}
      <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <FiActivity size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Monthly Reading Analytics
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Visualizing your finished book milestones.</p>
          </div>
        </div>

        {/* 📅 বছর সিলেকশন ড্রপডাউন (আইডিয়া ১) */}
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-[11px] font-bold text-zinc-400 outline-none cursor-pointer hover:border-zinc-700 transition"
        >
          <option value="2026">Year 2026</option>
          <option value="2025">Year 2025</option>
        </select>
      </div>

      {/* 📊 চার্ট রেন্ডারিং ব্লক */}
      {!hasData ? (
        /* 💡 এম্পটি স্টেট ট্র্যাকিং (আইডিয়া ৩) */
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-xl p-6 text-center">
          <p className="text-[11px] text-zinc-500 font-medium">
            📊 Analytics pipeline is empty. Complete a book delivery request to populate reading waves.
          </p>
        </div>
      ) : (
        /* 💎 প্রিমিয়াম চার্ট ইন্টারফেস (আইডিয়া ২) */
        <div className="w-full h-64 text-[10px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              
              {/* 🟢 প্রিমিয়াম গ্রেডিয়েন্ট কালার স্কিম ডেফিনিশন */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1f242d" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#4b5563" 
                tickLine={false} 
                dy={10} 
                className="font-semibold"
              />
              <YAxis 
                stroke="#4b5563" 
                tickLine={false} 
                dx={-5} 
                allowDecimals={false}
                className="font-semibold"
              />
              
              {/* কাস্টম গ্লাস টুলটিপ */}
              <Tooltip 
                cursor={{ fill: '#ffffff03' }}
                contentStyle={{ 
                  backgroundColor: "#090d13", 
                  borderColor: "#1f2937",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }} 
                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                labelStyle={{ color: "#6b7280", fontSize: "9px" }}
              />

              {/* স্মুথ বার ডিজাইন */}
              <Bar 
                dataKey="books" 
                fill="url(#chartGradient)" 
                stroke="#4f46e5"
                strokeWidth={1.5}
                radius={[5, 5, 0, 0]} 
                name="Books Read" 
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}