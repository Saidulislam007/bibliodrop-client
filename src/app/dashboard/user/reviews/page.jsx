"use client";

import React from "react";
import { FiEdit3, FiTrash2, FiStar } from "react-icons/fi";

export default function MyReviews() {
  const reviews = [
    { id: 1, book: "The Silent Patient", rating: 5, comment: "Absolutely brilliant psychological thriller! The plot twist completely blew my mind.", date: "Jun 16, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">My Reviews & Comments</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Manage your thoughts and ratings given to items.</p>
      </div>

      <div className="space-y-3.5">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-white text-sm">{rev.book}</h3>
                <div className="flex items-center gap-1 text-amber-400 mt-1">
                  {[...Array(rev.rating)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                  <span className="text-[10px] text-zinc-500 font-medium pl-1">{rev.date}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-all"><FiEdit3 size={13} /></button>
                <button className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md transition-all"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-medium bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/40">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}