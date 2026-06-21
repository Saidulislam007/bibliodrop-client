"use client";

import { getBooks } from "@/lib/api/books";
import { deleteBook, updateBookStatus } from "@/lib/actions/books"; // 📢 আপডেট অ্যাকশনটি এখানে ইম্পোর্ট করা হলো
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiLoader, FiX } from "react-icons/fi";

export default function ManageInventory() {
  const [myBooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 এডিট মোডাল হ্যান্ডেল করার জন্য স্টেটসমূহ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: "History",
    price: "",
    description: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // 🔄 ডাটাবেজ থেকে getBooks() ফাংশন দিয়ে রিয়েল ডাটা ফেচ করা
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

  // ✍️ ২. এডিট বাটন ক্লিক হ্যান্ডলার (মোডালে ডাটা পুশ করা)
  const openEditModal = (book) => {
    setEditingBookId(book._id);
    setEditFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "History",
      price: book.price || "",
      description: book.description || ""
    });
    setIsModalOpen(true);
  };

  // 🚀 ৩. এডিট ফর্ম সাবমিট হ্যান্ডলার (ডাটাবেজ ও ইউআই সিঙ্ক)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const updatedPayload = {
        title: editFormData.title,
        author: editFormData.author,
        category: editFormData.category,
        price: parseFloat(editFormData.price) || 0,
        description: editFormData.description
      };

      const result = await updateBookStatus(editingBookId, updatedPayload);

      if (
        result?.success || 
        result?.modifiedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert("🎉 Success! Book assets updated in database.");
        
        // রিফ্রেশ ছাড়াই রিয়েল-টাইমে UI স্টেট আপডেট
        setBooks(myBooks.map(book => 
          book._id === editingBookId ? { ...book, ...updatedPayload } : book
        ));
        
        setIsModalOpen(false); // মোডাল বন্ধ করা হলো
      } else {
        alert(`❌ Failed: ${result?.message || "Something went wrong during update."}`);
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("❌ A network error occurred.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ডিলিট হ্যান্ডলার ফাংশন
  const handleDeleteBook = async (bookId, bookTitle) => {
    try {
      const result = await deleteBook(bookId);
      if (result?.success || result?.deletedCount > 0 || result?.acknowledged === true) {
        alert(`🗑️ Deleted! "${bookTitle}" has been permanently removed.`);
        setBooks(myBooks.filter(book => book._id !== bookId));
      } else {
        alert(`❌ Failed: ${result?.message || "Could not delete the book asset."}`);
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
      alert("❌ A network error occurred while deleting the book.");
    }
  };

  // স্ট্যাটাস টগল বাটন
  const handleToggleStatus = (id, currentStatus) => {
    if (currentStatus === "Pending Approval") {
      alert("⚠️ Action Denied! You cannot publish a book until the Admin approves it.");
      return;
    }
    
    setBooks(myBooks.map(book => {
      if (book._id === id) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage Inventory</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Overview and manage your listed catalog status control.</p>
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
                {myBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-zinc-800/10 transition-colors">
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
                      
                      {/* ✍️ এডিট আইকন বাটন লিঙ্ক করা হলো */}
                      <button 
                        onClick={() => openEditModal(book)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete "${book.title}"?`)) {
                            handleDeleteBook(book._id, book.title);
                          }
                        }} 
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md transition-colors active:scale-90"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🛠️ পপ-আপ এডিট মোডাল ইউআই (Modal UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl relative text-xs text-zinc-300">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight">Edit Book Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Book Title</label>
                <input type="text" required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Author Name</label>
                <input type="text" required value={editFormData.author} onChange={e => setEditFormData({...editFormData, author: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                  <select value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white cursor-pointer">
                    <option value="History">History</option>
                    <option value="Romance">Romance</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Book Price ($)</label>
                  <input type="number" step="0.01" required value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea rows="3" required value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-1/2 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateLoading} 
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {updateLoading ? "Saving Assets..." : "Update Assets"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}