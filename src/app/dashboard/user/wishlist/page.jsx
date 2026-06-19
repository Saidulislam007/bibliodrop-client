"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";

export default function WishlistPage() {
  const wishlistBooks = [
    {
      id: 1,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: "$4.50",
      img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400", // আপনার স্ক্রিনশটের মতো ডামি বুক কভার
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">My Wishlist</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Books you've saved for later.</p>
      </div>

      {/* রেসপনসিভ কার্ড গ্রিড লেআউট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistBooks.map((book) => (
          <div key={book.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
            
            {/* বুক ইমেজ কন্টেইনার */}
            <div className="aspect-[4/3] w-full relative bg-zinc-800 p-2 flex items-center justify-center overflow-hidden">
              <img src={book.img} alt={book.title} className="w-full h-full object-cover rounded-xl" />
            </div>

            {/* কার্ড বডি মেটাডেটা */}
            <div className="p-4 space-y-4">
              <div className="space-y-0.5">
                <h3 className="font-bold text-white text-sm truncate">{book.title}</h3>
                <p className="text-xs text-zinc-500 truncate font-medium">{book.author}</p>
              </div>

              {/* প্রাইজ এবং অ্যাকশন কন্ট্রোল */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-amber-500 font-extrabold text-sm">{book.price}</span>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.97]">
                    View
                  </button>
                  <button className="p-2 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-xl transition-all" title="Remove from wishlist">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}