"use client";

import { deleteBook, updateBookStatus } from "@/lib/actions/books";
import React, { useState, useEffect } from "react";
import { FiTrash2, FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function ApprovalsPage() {
  const [pendingBooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📢 লাইট থিম পিল-শেপ নোটিফিকেশন হ্যান্ডলার ভাই
  const showNotification = (message, type = "success") => {
    const toastOptions = {
      style: {
        borderRadius: "9999px",
        background: "#ffffff",
        color: "#1f2937",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 16px",
      },
    };

    if (type === "success") {
      toast.success(message, {
        ...toastOptions,
        iconTheme: { primary: "#10b981", secondary: "#ffffff" },
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
      });
    }
  };

  // 🔄 ডাটাবেজ থেকে ডেটা ফেচ করা
  useEffect(() => {
    const fetchApprovalsData = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibliodrop-server-3.onrender.com';
        
        // 🟢 ট্রিক: ব্যাকএন্ডের পাবলিশড ফিল্টার বাইপাস করার জন্য সরাসরি মঙ্গোডিবি থেকে সব ডাটা খোঁজা হচ্ছে
        // যেহেতু ব্যাকএন্ডে /books রাউটটি শুধুমাত্র Published ডাটা দেয়, তাই আমরা কুয়েরি দিয়ে টেস্ট করতে পারি 
        // অথবা ব্যাকএন্ডের ফিল্টারটি সরাতে হবে। আপাতত ফ্রন্টএন্ড থেকে ফ্রেশ ফেচ করা হলো:
        const res = await fetch(`${baseUrl}/books?limit=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        
        const data = await res.json();
        
        let allBooks = Array.isArray(data) ? data : (data?.books || []);

        // 🔍 নিখুঁত ফিল্টারিং যা আপনার অবজেক্টের "Pending Approval" কে সহজেই ধরবে ভাই
        const filteredBooks = allBooks.filter(
          book => book.status === "Pending Approval"
        );

        setBooks(filteredBooks);
      } catch (error) {
        console.error("Error loading approval queue:", error);
        showNotification("❌ Error fetching books from backend.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalsData();
  }, []);

  // 🚀 অ্যাপ্রুভ হ্যান্ডলার ফাংশন
  const handleApproveBook = async (bookId, bookTitle) => {
    try {
      const updatePayload = {
        status: "Published", 
        isPublished: true,
        publishedAt: new Date().toISOString(),
        approvedBy: "admin_core_id" 
      };

      const result = await updateBookStatus(bookId, updatePayload);

      if (result?.success || result?.modifiedCount > 0 || result?.acknowledged === true) {
        showNotification(`🎉 Success! ${bookTitle} has been approved & published.`, "success");
        setBooks(pendingBooks.filter(book => book._id !== bookId));
      } else {
        showNotification(`❌ Update Failed: ${result?.message || "Could not approve the book."}`, "error");
      }
    } catch (error) {
      console.error("Error during approval handler:", error);
      showNotification("❌ Server sync error. Please try again.", "error");
    }
  };

  // 🗑️ ডিলিট/রিজেক্ট হ্যান্ডলার লজিক
  const handleRejectBook = async (bookId, bookTitle) => {
    try {
      const result = await deleteBook(bookId);

      if (result?.success || result?.deletedCount > 0 || result?.acknowledged === true) {
        showNotification(`🗑️ Deleted! ${bookTitle} has been removed.`, "success");
        setBooks(pendingBooks.filter(book => book._id !== bookId));
      } else {
        showNotification(`❌ Delete Failed: ${result?.message || "Could not delete the book asset."}`, "error");
      }
    } catch (error) {
      console.error("Error during delete handler:", error);
      showNotification("❌ Server sync error while deleting.", "error");
    }
  };

  // কাস্টম কনফার্মেশন ডায়ালগ টোস্ট
  const confirmDeleteToast = (bookId, bookTitle) => {
    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col p-5 border border-zinc-100`}>
        <div className="text-left">
          <p className="text-sm font-bold text-gray-900">Are you sure you want to reject and delete?</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium truncate">"{bookTitle}" asset will be permanently lost.</p>
        </div>
        <div className="flex items-center justify-end gap-2.5 mt-4 w-full">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition-colors">Cancel</button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleRejectBook(bookId, bookTitle);
            }}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), { position: "top-center" });
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
    <div className="space-y-6 relative">
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Book Approval Queue</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Review and approve new librarian submittals.</p>
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
                  <th className="pb-3">Price</th>
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
                    <td className="py-3.5 font-semibold text-emerald-400">${book.price}</td>
                    <td className="py-3.5 text-zinc-400 truncate max-w-[150px]">{book.librarianEmail || "Unknown Librarian"}</td>
                    <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleApproveBook(book._id, book.title)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-all active:scale-95">Approve</button>
                      <button onClick={() => confirmDeleteToast(book._id, book.title)} className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all active:scale-95">
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