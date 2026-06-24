"use client";

import { getBooks } from "@/lib/api/books";
// 🟢 ব্যাকএন্ড সার্ভার অ্যাকশন ইম্পোর্ট ভাই
import { deleteBook, updateBookStatus } from "@/lib/actions/books"; 
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiLoader, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast"; // 👈 react-hot-toast ইম্পোর্ট করা হলো ভাই

export default function ManageInventory() {
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

  // 📢 সুন্দর লাইট থিম নোটিফিকেশন ফাংশন ভাই
  const showNotification = (message, type = "success") => {
    const toastOptions = {
      style: {
        borderRadius: "9999px", // পিল শেপ বর্ডার
        background: "#ffffff",
        color: "#1f2937", // ডার্ক গ্রে টেক্সট
        border: "1px solid #e5e7eb", // হালকা গ্রে বর্ডার
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

  // ✍️ ২. এডিট বাটন ক্লিক হ্যান্ডলার
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

  // 🚀 ৩. ইন-লাইন ফর্ম সাবমিট হ্যান্ডলার
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

  // ডিলিট হ্যান্ডলার ফাংশন
  const handleDeleteBook = async (bookId, bookTitle) => {
    try {
      const result = await deleteBook(bookId);
      if (result?.success || result?.deletedCount > 0 || result?.acknowledged === true) {
        showNotification(`🗑️ Deleted! "${bookTitle}" has been removed.`, "success");
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

  // 🗑️ কাস্টম টোস্ট ডিলিট কনফার্মেশন পপআপ ভাই (ব্রাউজারের ডিফল্ট confirm ওড়ানো হলো)
  const confirmDelete = (bookId, bookTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-2.5 p-1 text-zinc-800">
        <p className="text-xs font-semibold">Are you sure you want to permanently delete <span className="font-bold text-rose-500">"{bookTitle}"</span>?</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              handleDeleteBook(bookId, bookTitle);
            }}
            className="px-2.5 py-1 text-[11px] bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-md shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      position: "top-center", // কনফার্মেশন টোস্টটি স্ক্রিনের মাঝখানে উপরে দেখা যাবে যেন চোখে পড়ে সহজে
      duration: 5000,
      style: {
        background: "#ffffff",
        border: "1px solid #fecdd3",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        padding: "12px",
        maxWidth: "320px"
      }
    });
  };

  // 🔄 🎯 ৪. আনপাবলিশ ক্লিক হ্যান্ডলার
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
      
      {/* 🔮 React Hot Toaster কন্টেইনার */}
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage Inventory</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Overview and manage your listed catalog status control.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {myBooks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">
              No book assets found in the inventory database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Cover</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th> 
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {myBooks.map((book) => {
                  const currentBookId = book._id?.$oid || book._id;
                  const isCurrentlyEditing = editingBookId === currentBookId;

                  return (
                    <React.Fragment key={currentBookId}>
                      {/* প্রধান ডাটা রো (Row) */}
                      <tr className="hover:bg-zinc-800/10 transition-colors">
                        <td className="py-3">
                          <div className="w-9 h-11 bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                            <img 
                              src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100"} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3.5 font-bold text-white max-w-[160px] truncate">{book.title}</td>
                        <td className="py-3.5 text-zinc-400">{book.author}</td>
                        <td className="py-3.5 text-zinc-500">{book.category}</td>
                        <td className="py-3.5 font-semibold text-amber-500">
                          ${book.price ? Number(book.price).toFixed(2) : "0.00"}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide ${statusStyles[book.status] || "bg-zinc-800 text-zinc-400"}`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                          
                          {/* 🔄 ডাইনামিক আনপাবলিশ/পাবলিশ বাটন */}
                          <button 
                            onClick={() => handleToggleStatus(book._id, book.status)} 
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all ${
                              book.status === 'Published' || book.status === 'Available'
                                ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700" 
                                : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                            }`}
                          >
                            {book.status === 'Published' || book.status === 'Available' ? "Unpublish" : "Publish"}
                          </button>
                          
                          {/* ✍️ এডিট বাটন */}
                          <button 
                            onClick={() => handleEditClick(book)}
                            className={`p-1.5 rounded-md transition-colors ${isCurrentlyEditing ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
                          >
                            <FiEdit2 size={12} />
                          </button>
                          
                          {/* ডিলিট বাটন */}
                          <button 
                            onClick={() => confirmDelete(currentBookId, book.title)} 
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md transition-colors active:scale-90"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </td>
                      </tr>

                      {/* ইন-লাইন এডিট ফর্ম */}
                      {isCurrentlyEditing && (
                        <tr className="bg-zinc-950/60 border-l-2 border-indigo-500">
                          <td colSpan="7" className="p-6">
                            <div className="max-w-xl mx-auto space-y-4 text-left text-zinc-300">
                              
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                <h2 className="text-sm font-black text-white tracking-tight">Edit Book Details</h2>
                                <button 
                                  onClick={() => setEditingBookId(null)} 
                                  className="text-zinc-500 hover:text-white p-1 rounded-md transition-colors"
                                >
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
                                  <button 
                                    type="button" 
                                    onClick={() => setEditingBookId(null)} 
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold rounded-xl transition-all"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="submit" 
                                    disabled={updateLoading} 
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                  >
                                    {updateLoading ? "Saving Assets..." : "Update Assets"}
                                  </button>
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