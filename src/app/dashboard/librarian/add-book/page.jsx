"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { createBooks } from "@/lib/actions/books";

export default function AddBook() {
  const { data: session } = authClient.useSession();

  const [formData, setForm] = useState({ 
    title: "", 
    author: "", 
    category: "History", 
    fee: "", 
    stock: "1", 
    description: "" 
  });
  
  const [imageUrlInput, setImageUrlInput] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = imageUrlInput.trim(); 

      if (!imageUrl) {
        alert("⚠️ Please provide a valid Book Cover Image URL.");
        setLoading(false);
        return;
      }

      const bookPayload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        fee: parseFloat(formData.fee) || 0, 
        image: imageUrl, 
        status: "Pending Approval", 
        
        librarianId: session?.user?.id || "unknown_id",
        librarianEmail: session?.user?.email || "unknown_email",
        dateAdded: new Date().toISOString(), 

        isPublished: false, 
        approvedBy: null,   
        publishedAt: null,  
        totalRequests: 0,   
        stockQuantity: parseInt(formData.stock) || 1 
      };

      console.log("Submitting Book to backend:", bookPayload);

      const result = await createBooks(bookPayload);
      console.log("Backend Raw Response Log:", result);

      // 🛡️ ফিক্স: মঙ্গোডিবির ড্রাইভার বা কাস্টম সাকসেস মেকানিজম সব ফরম্যাট ট্র্যাক করার জন্য কন্ডিশন আপডেট
      if (
        result?.success || 
        result?._id || 
        result?.insertedId || 
        result?.acknowledged === true
      ) {
        alert("🎉 Success! Book submitted to database. Initial Status: Pending Approval.");
        // ফর্ম সম্পূর্ণ ক্লিয়ার করা হলো
        setForm({ title: "", author: "", category: "History", fee: "", stock: "1", description: "" });
        setImageUrlInput(""); 
      } else {
        alert(`❌ Failed: ${result?.message || "Something went wrong while saving the book."}`);
      }

    } catch (err) {
      console.error("Error in component submit:", err);
      alert("❌ A network error occurred. Please check your server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Add New Book</h1>
        <p className="text-xs text-zinc-400 mt-0.5">List a new item. Admin approval is strictly required before publishing.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 space-y-4 shadow-md">
        
        {/* টাইটেল এবং অথর */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Book Title</label>
            <input type="text" required value={formData.title} onChange={e => setForm({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="e.g. The Hobbit" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Author Name</label>
            <input type="text" required value={formData.author} onChange={e => setForm({...formData, author: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="J.R.R. Tolkien" />
          </div>
        </div>

        {/* ক্যাটাগরি, ডেলিভারি ফি এবং স্টক কোয়ান্টিটি */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Category</label>
            <select value={formData.category} onChange={e => setForm({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white cursor-pointer">
              <option value="History">History</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Delivery Fee ($)</label>
            <input type="number" step="0.01" required value={formData.fee} onChange={e => setForm({...formData, fee: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="4.50" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Stock Copies</label>
            <input type="number" min="1" required value={formData.stock} onChange={e => setForm({...formData, stock: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="5" />
          </div>
        </div>

        {/* ডেসক্রিপশন */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Description</label>
          <textarea rows="3" required value={formData.description} onChange={e => setForm({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white resize-none" placeholder="Write a short briefing about the book..." />
        </div>

        {/* সরাসরি ইমেজ ইউআরএল পেস্ট করার অপশন */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Book Cover Image URL</label>
          <input type="url" required value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="https://i.ibb.co/your-hosting-image-link.png" />
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] mt-4">
          {loading ? "Processing Asset..." : "Submit Book Asset"}
        </button>
      </form>
    </div>
  );
}