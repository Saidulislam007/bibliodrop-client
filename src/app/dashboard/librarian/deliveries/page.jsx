"use client";

import React, { useState } from "react";

export default function ManageDeliveries() {
  const [deliveries, setDeliveries] = useState([
    { id: 1, client: "Sarah Mitchell", book: "The Silent Patient", date: "Jun 19, 2026", status: "Pending" },
    { id: 2, client: "Saidul Islam", book: "Atomic Habits", date: "Jun 20, 2026", status: "Dispatched" }
  ]);

  // স্ট্যাটাস হ্যান্ডলার লজিক (Pending ➡️ Dispatched ➡️ Delivered)
  const handleNextStatus = (id, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === "Pending") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Delivered";
    else return; // অলরেডি ডেলিভারড থাকলে নো একশন

    setDeliveries(deliveries.map(item => item.id === id ? { ...item, status: nextStatus } : item));
  };

  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage Deliveries</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Update client order drop cycles smoothly.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">Client Name</th>
                <th className="pb-3">Book Title</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Update Drop Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              {deliveries.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="py-3.5 font-semibold text-white">{item.client}</td>
                  <td className="py-3.5 text-zinc-400">{item.book}</td>
                  <td className="py-3.5 text-zinc-500">{item.date}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {item.status !== "Delivered" ? (
                      <button onClick={() => handleNextStatus(item.id, item.status)} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-[11px] border border-zinc-700 transition-all active:scale-95">
                        Mark as {item.status === "Pending" ? "Dispatched" : "Delivered"}
                      </button>
                    ) : (
                      <span className="text-zinc-500 text-[11px] font-bold italic pr-2">✓ Lifecycle Completed</span>
                    )}
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