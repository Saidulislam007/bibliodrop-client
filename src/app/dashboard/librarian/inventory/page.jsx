"use client";

import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ManageInventory() {
  // ডামি ডেটা যা আপনার স্ক্রিনশটের স্ট্যাটাসের সাথে পুরোপুরি ম্যাচ করে
  const [myBooks, setBooks] = useState([
    { id: 1, title: "Voluptatibus dolor q", author: "Fuga Quaerat commod", category: "History", status: "Pending Approval" },
    { id: 2, title: "Quia sunt eum incidu", author: "Quas consequatur od", category: "Romance", status: "Unpublished" },
    { id: 3, title: "Proident sunt sunt", author: "Eos dolores pariatu", category: "History", status: "Published" },
  ]);

  // স্ট্যাটাস টগল পাওয়ার বাটন (পেন্ডিং থাকলে বন্ধ থাকবে, পাবলিশড থাকলে আনপাবলিশ করা যাবে)
  const handleToggleStatus = (id, currentStatus) => {
    if (currentStatus === "Pending Approval") {
      alert("⚠️ Action Denied! You cannot publish a book until the Admin approves it.");
      return;
    }
    
    setBooks(myBooks.map(book => {
      if (book.id === id) {
        return {
          ...book,
          status: currentStatus === "Published" ? "Unpublished" : "Published"
        };
      }
      return book;
    }));
  };

  const statusStyles = {
    "Pending Approval": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Unpublished": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "Published": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage Inventory</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Overview and manage your listed catalog status control.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">Title</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              {myBooks.map((book) => (
                <tr key={book.id} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="py-3.5 font-bold text-white">{book.title}</td>
                  <td className="py-3.5 text-zinc-400">{book.author}</td>
                  <td className="py-3.5 text-zinc-500">{book.category}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide ${statusStyles[book.status]}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    {/* টগল বাটন */}
                    <button onClick={() => handleToggleStatus(book.id, book.status)} className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all ${
                      book.status === 'Published' 
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700" 
                        : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                    }`}>
                      {book.status === 'Published' ? "Unpublish" : "Publish"}
                    </button>
                    <button className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md"><FiEdit2 size={12} /></button>
                    <button className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md"><FiTrash2 size={12} /></button>
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