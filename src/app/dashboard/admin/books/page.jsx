"use client";

import { getBooks } from "@/lib/api/books";
// 🟢 ব্যাকএন্ড সার্ভার অ্যাকশন ইম্পোর্ট ভাই
import { deleteBook, updateBookStatus } from "@/lib/actions/books"; 
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiLoader, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast"; // 👈 react-hot-toast ইম্পোর্ট করা হলো ভাই

export default function BooksPage() {
  const [myBooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 ইন-লাইন এডিটিং এর স্টেটসমূহ ভাই
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: "History",
    price: "",
    description: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // 📢 আপনার আগের পেজগুলোর মতো লাইট থিম পিল-শেপ নোটিফিকেশন হ্যান্ডলার ভাই
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
        iconTheme: {
          primary: "#10b981",
          secondary: "#ffffff",
        },
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#ef4444",
          secondary: "#ffffff",
        },
      });
    }
  };

  // 🔄 ডাটাবেজ থেকে রিয়েল ডাটা ফেচ করা
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const data = await getBooks("", ""); 
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data?.books) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error("Error loading inventory books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // ✍️ এডিট বাটন ক্লিক হ্যান্ডলার
  const handleEditClick = (bookItem) => {
    const targetId = bookItem._id?.$oid || bookItem._id;
    
    if (editingBookId === targetId) {
      setEditingBookId(null);
      return;
    }

    setEditingBookId(targetId);
    setEditFormData({
      title: bookItem.title || "",
      author: bookItem.author || "",
      category: bookItem.category || "History",
      price: bookItem.price !== undefined && bookItem.price !== null ? bookItem.price.toString() : "", 
      description: bookItem.description || ""
    });
  };

  // 🚀 ইন-লাইন ফর্ম সাবমিট হ্যান্ডলার (ডাটাবেজ ও ইউআই রিয়াল-টাইম সিঙ্ক)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingBookId) return;
    
    try {
      setUpdateLoading(true);

      const updatedPayload = {
        title: editFormData.title.trim(),
        author: editFormData.author.trim(),
        category: editFormData.category,
        price: parseFloat(editFormData.price) || 0,
        description: editFormData.description.trim()
      };

      const result = await updateBookStatus(editingBookId, updatedPayload);

      if (
        result?.success || 
        result?.modifiedCount > 0 || 
        result?.matchedCount > 0 ||
        result?.acknowledged === true
      ) {
        setBooks((prevBooks) =>
          prevBooks.map((b) => {
            const currentId = b._id?.$oid || b._id;
            return currentId === editingBookId ? { ...b, ...updatedPayload } : b;
          })
        );
        
        showNotification("🎉 Success! Book assets updated in database.", "success");
        setEditingBookId(null); 
      } else {
        showNotification(`❌ Failed: ${result?.message || "No changes detected or update rejected."}`, "error");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      showNotification("❌ A network error occurred.", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ডিলিট অ্যাকশন সম্পাদন করার ফাংশন
  const handleActualDelete = async (bookId, bookTitle) => {
    try {
      const result = await deleteBook(bookId);
      if (result?.success || result?.deletedCount > 0 || result?.acknowledged === true) {
        showNotification(`🗑️ Deleted! "${bookTitle}" has been permanently removed.`, "success");
        setBooks(myBooks.filter(b => {
          const currentId = b._id?.$oid || b._id;
          return currentId !== bookId;
        }));
      } else {
        showNotification(`❌ Failed: ${result?.message || "Could not delete the book asset."}`, "error");
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
      showNotification("❌ A network error occurred.", "error");
    }
  };

  // ⚠️ টেইলউইন্ড লেআউট ও গ্রিড ফিক্সড কনফার্মেশন ডায়ালগ টোস্ট ভাই (বাটন হাইড হবে না)
  const confirmDeleteToast = (bookId, bookTitle) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-5 border border-zinc-100`}
      >
        <div className="text-left w-full">
          <p className="text-sm font-bold text-gray-950">
            Are you sure you want to permanently delete?
          </p>
          <p className="mt-1 text-xs text-zinc-500 font-medium truncate">
            "${bookTitle}" asset will be permanently lost.
          </p>
        </div>
        
        {/* 🛠️ সমান col-2 গ্রিড লেআউট ভাই */}
        <div className="grid grid-cols-2 gap-3 mt-5 w-full pt-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition-all active:scale-95 text-center block"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              handleActualDelete(bookId, bookTitle);
            }}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-black rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95 text-center block"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), { position: "top-center" });
  };

  // 🔄 আনপাবলিশ/পাবলিশ বাটন টগল হ্যান্ডলার ভাই
  const handleToggleStatus = async (id, currentStatus) => {
    const targetId = id?.$oid || id;
    const nextStatus = currentStatus === "Published" ? "Pending Approval" : "Published";
    
    try {
      const result = await updateBookStatus(targetId, { status: nextStatus });
      
      if (result?.success || result?.modifiedCount > 0 || result?.acknowledged === true) {
        setBooks((prevBooks) => 
          prevBooks.map(b => {
            const currentId = b._id?.$oid || b._id;
            return currentId === targetId ? { ...b, status: nextStatus } : b;
          })
        );
        showNotification(`🎉 Success! Status set to "${nextStatus}".`, "success");
      } else {
        showNotification(`❌ Failed: ${result?.message || "Could not update status asset."}`, "error");
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      showNotification("❌ A network error occurred while toggling status.", "error");
    }
  };

  const statusStyles = {
    "Pending Approval": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Unpublished": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "Published": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Available": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-zinc-400">
        <FiLoader size={24} className="animate-spin text-indigo-500" />
        <p className="text-xs font-semibold tracking-wider">LOADING DATA CORE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      {/* 🔮 React Hot Toaster কন্টেইনার ভাই */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* হেডার পার্ট: আপনার এই পেজের টেক্সট */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage All Marketplace Listings</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Administrative override command dashboard for book assets.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {myBooks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">
              No book assets found in the inventory database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3 w-16">COVER</th>
                  <th className="pb-3">TITLE</th>
                  <th className="pb-3">AUTHOR</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">PRICE</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Override Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {myBooks.map((book) => {
                  const currentBookId = book._id?.$oid || book._id;
                  const isCurrentlyEditing = editingBookId === currentBookId;

                  return (
                    <React.Fragment key={currentBookId}>
                      <tr className="hover:bg-zinc-800/10 transition-colors">
                        {/* ১. COVER */}
                        <td className="py-3">
                          <div className="w-9 h-11 bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                            <img 
                              src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100"} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* ২. TITLE */}
                        <td className="py-3.5 font-bold text-white max-w-[160px] truncate">
                          {book.title}
                        </td>

                        {/* ৩. AUTHOR */}
                        <td className="py-3.5 text-zinc-400">
                          {book.author}
                        </td>

                        {/* ৪. CATEGORY */}
                        <td className="py-3.5 text-zinc-500">
                          {book.category}
                        </td>

                        {/* ৫. PRICE */}
                        <td className="py-3.5 font-semibold text-amber-500">
                          ${book.price ? Number(book.price).toFixed(2) : "0.00"}
                        </td>

                        {/* ৬. Status */}
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide ${statusStyles[book.status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                            {book.status}
                          </span>
                        </td>

                        {/* ৭. Override Actions */}
                        <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                          {/* ডাইনামিক আনপাবলিশ বাটন ভাই */}
                          <button 
                            type="button"
                            onClick={() => handleToggleStatus(book._id, book.status)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all ${
                              book.status === 'Published' || book.status === 'Available'
                                ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750" 
                                : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                            }`}
                          >
                            {book.status === 'Published' || book.status === 'Available' ? "Unpublish" : "Publish"}
                          </button>

                          {/* এডিট বাটন */}
                          <button 
                            type="button"
                            onClick={() => handleEditClick(book)}
                            className={`p-1.5 rounded-md transition-colors ${isCurrentlyEditing ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                          >
                            <FiEdit2 size={12} />
                          </button>

                          {/* ডিলিট বাটন */}
                          <button 
                            type="button"
                            onClick={() => confirmDeleteToast(currentBookId, book.title)} 
                            className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md transition-colors active:scale-90"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </td>
                      </tr>

                      {/* ইন-লাইন ফর্ম ড্রপডাউন */}
                      {isCurrentlyEditing && (
                        <tr className="bg-zinc-950/60 border-l-2 border-indigo-500">
                          <td colSpan="7" className="p-6">
                            <div className="max-w-xl mx-auto space-y-4 text-left text-zinc-300">
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                <h2 className="text-sm font-black text-white tracking-tight">Edit Book Details</h2>
                                <button type="button" onClick={() => setEditingBookId(null)} className="text-zinc-500 hover:text-white p-1 rounded-md transition-colors">
                                  <FiX size={14} />
                                </button>
                              </div>

                              <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Book Title</label>
                                  <input type="text" required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Author Name</label>
                                  <input type="text" required value={editFormData.author} onChange={e => setEditFormData({...editFormData, author: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                                    <select value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white cursor-pointer">
                                      <option value="History">History</option>
                                      <option value="Romance">Romance</option>
                                      <option value="Mystery">Mystery</option>
                                      <option value="Sci-Fi">Sci-Fi</option>
                                      <option value="Academic">Academic</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Book Price ($)</label>
                                    <input type="number" step="0.01" required value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                                  <textarea rows="3" required value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white resize-none" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <button type="button" onClick={() => setEditingBookId(null)} className="px-4 py-2 bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-all">Cancel</button>
                                  <button type="submit" disabled={updateLoading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5">{updateLoading ? "Saving..." : "Update"}</button>
                                </div>
                              </form>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}