"use client";

import React from "react";

export default function DeliveryHistory() {
  const history = [
    { id: 1, title: "The Silent Patient", fee: "$4.50", date: "Jun 15, 2026", status: "Delivered" },
    { id: 2, title: "Project Hail Mary", fee: "$5.00", date: "Jun 18, 2026", status: "Dispatched" },
    { id: 3, title: "Atomic Habits", fee: "$3.50", date: "Jun 20, 2026", status: "Pending" },
  ];

  const statusColors = {
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Delivery History</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Track your past and active book drop deliveries.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">Book Title</th>
                <th className="pb-3">Delivery Fee</th>
                <th className="pb-3">Request Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="py-3.5 font-bold text-white">{item.title}</td>
                  <td className="py-3.5 text-zinc-400">{item.fee}</td>
                  <td className="py-3.5 text-zinc-500">{item.date}</td>
                  <td className="py-3.5 text-right">
                    <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}