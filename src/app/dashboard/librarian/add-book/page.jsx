"use client";

import React, { useState } from "react";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";

export default function AddBook() {
  const [formData, setForm] = useState({ title: "", author: "", category: "History", fee: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        // 🚀 ImgBB API এর মাধ্যমে ছবি হোস্টিং মেকানিজম
        const imgFormData = new FormData();
        imgFormData.append("image", image);
        
        // আপনার নিজের ImgBB API Key এখানে বসাবেন ভাই
        const imgbbKey = "YOUR_IMGBB_API_KEY"; 
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: imgFormData,
        });
        const imgData = await response.json();
        imageUrl = imgData.data.url;
      }

      // ফাইনাল বুক অবজেক্ট যা ব্যাকএন্ডে সাবমিট হবে
      const bookPayload = {
        ...formData,
        image: imageUrl,
        status: "Pending Approval", // 🛡️ রিকোয়ারমেন্ট অনুযায়ী স্ট্রাক্ট রুল
        createdAt: new Date()
      };

      console.log("Submitting Book to backend:", bookPayload);
      alert("🎉 Success! Book submitted. Initial Status: Pending Approval.");
      
      // রিসেট ফর্ম
      setForm({ title: "", author: "", category: "History", fee: "", description: "" });
      setImage(null);
    } catch (err) {
      console.error(err);
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
            <label className="text-[11px] font-bold text-zinc-400 uppercase">Delivery Fee ($)</label>
            <input type="number" required value={formData.fee} onChange={e => setForm({...formData, fee: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white" placeholder="4.50" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Description</label>
          <textarea rows="3" required value={formData.description} onChange={e => setForm({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white resize-none" placeholder="Write a short briefing about the book..." />
        </div>

        {/* ইমেজ আপলোড ড্রপজোন */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Book Cover Image</label>
          <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-6 text-center cursor-pointer relative bg-zinc-950/30">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-400">
              <FiUploadCloud size={24} className="text-zinc-500" />
              <p className="text-[11px] font-medium">{image ? `Selected: ${image.name}` : "Click or Drag to Upload Book Cover"}</p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98]">
          {loading ? "Uploading to ImgBB..." : "Submit Book Asset"}
        </button>
      </form>
    </div>
  );
}