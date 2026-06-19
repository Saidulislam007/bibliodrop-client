"use client";

import React from "react";

export default function ReadingList() {
  const books = [
    { id: 1, title: "The Silent Patient", author: "Alex Michaelides", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300", type: "Currently Reading" },
    { id: 2, title: "Atomic Habits", author: "James Clear", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300", type: "Returned / Completed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">My Reading List</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Books you are currently devouring or have finished.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {books.map((book) => (
          <div key={book.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="aspect-[4/3] w-full relative bg-zinc-800">
              <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
              <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold rounded-md text-white bg-black/70 backdrop-blur-sm`}>
                {book.type}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-white text-sm truncate">{book.title}</h3>
              <p className="text-xs text-zinc-500 truncate">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}