"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiTruck, FiEdit2, FiEyeOff, FiTrash2, FiStar, FiClock } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api/books"; 
import { deleteBook } from "@/lib/actions/books";

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // রিকোয়ারমেন্ট অনুযায়ী মক রিভিউ ডেটা
  const dummyReviews = [
    { id: 1, user: "Ziaan Islam", rating: 5, comment: "Absolutely marvelous scientific briefing. Highly tracking asset!" },
    { id: 2, user: "Md. Saidul", rating: 4, comment: "Clean concept wrapper. The description matches the theme perfectly." }
  ];

  useEffect(() => {
    const fetchSingleBook = async () => {
      try {
        setLoading(true);
        const data = await getBooks("", "");
        const allBooks = Array.isArray(data) ? data : data?.books || [];
        const currentBook = allBooks.find(b => b._id === id);
        setBook(currentBook);
      } catch (err) {
        console.error("Error reading book asset details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSingleBook();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("⚠️ Proceed with caution. Are you sure you want to delete this library asset permanently?")) return;
    try {
      setActionLoading(true);
      await deleteBook(book._id);
      alert("🗑️ Asset successfully deleted.");
      router.push("/browse"); // ডিলিট হওয়ার পর সফলভাবে /browse পেজে রিডাইরেক্ট হবে
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStripeCheckout = () => {
    if (!session?.user) {
      alert("🔒 Authentication required! Please log in to your account to order a book delivery.");
      return;
    }
    alert(`💳 Redirecting to Stripe Checkout to securely process Delivery Fee: $${book.fee?.toFixed(2)}`);
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-bold tracking-wider animate-pulse">SYNCHRONIZING ASSET COMPONENT...</div>;
  if (!book) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-rose-400 text-xs font-bold">❌ 404: BOOK CATALOG NOT FOUND IN CORE DATABASE.</div>;

  const isLibrarianOwner = session?.user?.email === book.librarianEmail;
  const isOutOfStock = (book.stockQuantity || 0) < 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 space-y-10 max-w-5xl mx-auto">
      <button onClick={() => router.push("/browse")} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
        <FiArrowLeft size={14} /> Back to Catalog Exploration
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-900 border border-zinc-800/60 p-6 md:p-8 rounded-3xl shadow-lg">
        {/* কভার ইমেজ */}
        <div className="md:col-span-5 w-full h-[360px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-inner">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center text-xs font-black text-rose-400 uppercase tracking-widest">
              Checked Out (Unavailable)
            </div>
          )}
        </div>

        {/* মেটাডাটা */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-md tracking-wider">
                {book.category}
              </span>
              <span className="text-[10px] font-bold flex items-center gap-1 text-zinc-500">
                <FiClock /> Added: {new Date(book.dateAdded || book.publishedAt || "").toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">{book.title}</h1>
              <p className="text-xs text-zinc-400 font-medium">Written by <strong className="text-zinc-200">{book.author}</strong></p>
            </div>

            <div className="border-t border-zinc-800/60 pt-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Briefing Description</h4>
              <p className="text-xs text-zinc-400 leading-relaxed text-justify">{book.description}</p>
            </div>
          </div>

          {/* প্রাইস বক্স ও কন্ডিশনাল বাটন কন্ট্রোল */}
          <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4 mt-4">
            <div className="flex gap-6 text-xs">
              <div>
                <p className="text-zinc-500 font-semibold text-[10px] uppercase">Market Value</p>
                <p className="text-base font-black text-amber-500">${book.price || "0"}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold text-[10px] uppercase">Delivery Rate</p>
                <p className="text-base font-black text-emerald-400">${book.fee?.toFixed(2) || "0.00"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLibrarianOwner ? (
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg font-bold text-xs flex items-center gap-1 transition-all"><FiEdit2 size={12}/> Edit</button>
                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg font-bold text-xs flex items-center gap-1 transition-all"><FiEyeOff size={12}/> Unpublish</button>
                  <button onClick={handleDelete} disabled={actionLoading} className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all"><FiTrash2 size={14}/></button>
                </div>
              ) : (
                <button 
                  onClick={handleStripeCheckout}
                  disabled={isOutOfStock}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md tracking-wide flex items-center gap-2 transition-all active:scale-[0.98] ${
                    isOutOfStock 
                      ? "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  <FiTruck size={14} /> {isOutOfStock ? "Unavailable (Checked Out)" : "Request Home Delivery"}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* রিভিউ সেকশন */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Reader Experiences & Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyReviews.map((rev) => (
            <div key={rev.id} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">{rev.user}</p>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, idx) => <FiStar size={11} fill="currentColor" key={idx} />)}
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-medium italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}