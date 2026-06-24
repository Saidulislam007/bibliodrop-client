"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { authClient } from "@/lib/auth-client"; 
import { createBooks } from "@/lib/actions/books";
import toast, { Toaster } from "react-hot-toast"; // 👈 react-hot-toast ইম্পোর্ট করা হলো ভাই

export default function AddBook() {
  const { data: session } = authClient.useSession();
  const router = useRouter(); 

  const [formData, setForm] = useState({ 
    title: "", 
    author: "", 
    category: "History", 
    fee: "", 
    price: "", // ➕ নতুন ফিল্ড: বইয়ের দামের জন্য স্টেট যোগ করা হলো
    stock: "1", 
    description: "" 
  });
  
  const [imageUrlInput, setImageUrlInput] = useState(""); 
  const [loading, setLoading] = useState(false);

  // 📢 image_88eee4.png এর মতো লাইট থিম নোটিফিকেশন ফাংশন ভাই
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
          primary: "#10b981", // গ্রিন টিক মার্ক
          secondary: "#ffffff",
        },
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#ef4444", // ক্রস মার্ক
          secondary: "#ffffff",
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = imageUrlInput.trim(); 

      if (!imageUrl) {
        showNotification("⚠️ Please provide a valid Book Cover Image URL.", "error");
        setLoading(false);
        return;
      }

      const bookPayload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        fee: parseFloat(formData.fee) || 0, 
        price: parseFloat(formData.price) || 0, // ➕ আপনার ডাটাবেজের জন্য বুক প্রাইস ফিল্ড নাম্বারে কনভার্ট করে যুক্ত করা হলো
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

      if (
        result?.success || 
        result?._id || 
        result?.insertedId || 
        result?.acknowledged === true
      ) {
        showNotification("🎉 Success! Book submitted to database. Initial Status: Pending Approval.", "success");
        
        // ফর্ম সম্পূর্ণ ক্লিয়ার করা হলো
        setForm({ title: "", author: "", category: "History", fee: "", price: "", stock: "1", description: "" });
        setImageUrlInput(""); 

        router.push("/dashboard/librarian/inventory");
        router.refresh(); 
      } else {
        showNotification(`❌ Failed: ${result?.message || "Something went wrong while saving the book."}`, "error");
      }

    } catch (err) {
      console.error("Error in component submit:", err);
      showNotification("❌ A network error occurred. Please check your server status.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl relative">
      
      {/* 🔮 React Hot Toaster - যা টোস্টকে ডান পাশে লাইট থিমে দেখাবে ভাই */}
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add New Book</h1>
        <p className="text-xs text-zinc-600 mt-0.5">List a new item. Admin approval is strictly required before publishing.</p>
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

        {/* ক্যাটাগরি, ডেলিভারি ফি, বুক প্রাইস এবং স্টক কোয়ান্টিটি */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Category</label>
            <select value={formData.category} onChange={e => setForm({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white cursor-pointer">
              <option value="History">History</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Academic">Academic</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Stock Copies</label>
            <input type="number" min="1" required value={formData.stock} onChange={e => setForm({...formData, stock: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="5" />
          </div>
        </div>

        {/* নতুন রেট অ্যান্ড প্রাইস কলাম রো */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Delivery Fee ($)</label>
            <input type="number" step="0.01" required value={formData.fee} onChange={e => setForm({...formData, fee: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="4.50" />
          </div>

          {/* ➕ নতুন ইউআই ইনপুট ফিল্ড: বুক প্রাইস */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Book Price ($)</label>
            <input type="number" step="0.01" required value={formData.price} onChange={e => setForm({...formData, price: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="15.00" />
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

        <button type="submit" disabled={loading} className="w-full py-2.5 bg-white hover:bg-gray-600 text-gray-900 font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] mt-4">
          {loading ? "Processing Asset..." : "Submit Book Asset"}
        </button>
      </form>
    </div>
  );
}