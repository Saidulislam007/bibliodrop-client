"use client";

import { deleteBook, updateBookStatus } from "@/lib/actions/books";
import { getBooks } from "@/lib/api/books";
import React, { useState, useEffect } from "react";
import { FiTrash2, FiLoader } from "react-icons/fi";
 // 📢 ডিলিট অ্যাকশনটি এখানে ইম্পোর্ট করা হলো

export default function ApprovalsPage() {
  const [pendingBooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 ডাটাবেজ থেকে ডেটা ফেচ করা
  useEffect(() => {
    const fetchApprovalsData = async () => {
      try {
        setLoading(true);
        const data = await getBooks("", ""); 
        
        let allBooks = [];
        if (Array.isArray(data)) {
          allBooks = data;
        } else if (data?.books) {
          allBooks = data.books;
        }

        // শুধুমাত্র "Pending Approval" স্ট্যাটাসের বইগুলো ফিল্টার করা হলো
        const filteredBooks = allBooks.filter(book => book.status === "Pending Approval");
        setBooks(filteredBooks);
      } catch (error) {
        console.error("Error loading approval queue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalsData();
  }, []);

  // 🚀 ১. অ্যাপ্রুভ হ্যান্ডলার ফাংশন (ডাটাবেজ ও ইউআই সিঙ্ক)
  const handleApproveBook = async (bookId, bookTitle) => {
    try {
      const updatePayload = {
        status: "Published", 
        isPublished: true,
        publishedAt: new Date().toISOString(),
        approvedBy: "admin_core_id" 
      };

      const result = await updateBookStatus(bookId, updatePayload);

      if (
        result?.success || 
        result?.modifiedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert(`🎉 Success! ${bookTitle} has been successfully approved & published.`);
        setBooks(pendingBooks.filter(book => book._id !== bookId));
      } else {
        alert(`❌ Update Failed: ${result?.message || "Could not approve the book."}`);
      }
    } catch (error) {
      console.error("Error during approval handler:", error);
      alert("❌ Server sync error. Please try again.");
    }
  };

  // 🗑️ ২. ডিলিট/রিজেক্ট হ্যান্ডলার লজিক (ডাটাবেজ ও ইউআই সিঙ্ক)
  const handleRejectBook = async (bookId, bookTitle) => {
    try {
      // ব্যাকএন্ড ডিলিট অ্যাকশন কল করা হলো
      const result = await deleteBook(bookId);

      // মঙ্গোডিবির ড্রাইভার সাধারণত deletedCount রিটার্ন করে
      if (
        result?.success || 
        result?.deletedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert(`🗑️ Deleted! ${bookTitle} has been removed from the database.`);
        // সফল হলে ক্লায়েন্ট সাইড UI থেকেও বইটি সরিয়ে দেওয়া হলো
        setBooks(pendingBooks.filter(book => book._id !== bookId));
      } else {
        alert(`❌ Delete Failed: ${result?.message || "Could not delete the book asset."}`);
      }
    } catch (error) {
      console.error("Error during delete handler:", error);
      alert("❌ Server sync error while deleting. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-zinc-400">
        <FiLoader size={24} className="animate-spin text-indigo-500" />
        <p className="text-xs font-semibold tracking-wider">LOADING APPROVAL CORE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Book Approval Queue</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Review and approve new librarian submittals.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {pendingBooks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">
              🎉 Clear! No pending book submissions require approval.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Fee</th>
                  <th className="pb-3">Librarian</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {pendingBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="py-3.5 font-bold text-white max-w-[200px] truncate">{book.title}</td>
                    <td className="py-3.5 text-zinc-400">{book.author}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-md">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-emerald-400">
                      ${book.fee ? Number(book.fee).toFixed(2) : "0.00"}
                    </td>
                    <td className="py-3.5 text-zinc-400 truncate max-w-[150px]">
                      {book.librarianEmail || "Unknown Librarian"}
                    </td>
                    <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => handleApproveBook(book._id, book.title)} 
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-all active:scale-95"
                      >
                        Approve
                      </button>
                      
                      {/* ডাইনামিকলি ব্যাকএন্ডের সাথে যুক্ত ডিলিট বাটন */}
                      <button 
                        onClick={() => {
                          if(confirm(`Are you sure you want to reject and delete "${book.title}"?`)) {
                            handleRejectBook(book._id, book.title);
                          }
                        }} 
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all active:scale-95"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}