import { getBooks } from "@/lib/api/books";
import React from "react";

export default async function FeaturedBooks() {
  let books = [];
  
  try {
    // 🎯 হোম পেজের জন্য প্রথম পেজ থেকে মাত্র ৬টি বই রিকোয়েস্ট করা হলো
    const data = await getBooks("", "All", 1, 6);
    
    // ব্যাকএন্ড অবজেক্ট { success: true, books: [...] } থেকে অ্যারে আলাদা করা হলো
    books = data?.books || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("FeaturedBooks fetch failed:", error);
    books = []; 
  }

  // যদি কোনো বই না পাওয়া যায় বা সার্ভার অফ থাকে, তবে সুন্দর একটি ফলব্যাক মেসেজ দেখাবে
  if (books.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full text-center py-20 text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#121314]">
          No featured book assets available at the moment.
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">
        Featured <span className="text-indigo-500">Books Catalog</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {/* 🎯 প্রথম ৩টি বই চমৎকারভাবে লুপ করে প্রিমিয়াম UI কার্ডে দেখানো হচ্ছে */}
        {books.slice(0, 3).map((book) => {
          const currentBookId = book._id?.$oid || book._id;
          
          return (
            <div 
              key={currentBookId} 
              className="bg-white dark:bg-[#121314] border border-slate-200/60 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between min-h-[220px] group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    {book.category || "General"}
                  </span>
                  <span className="text-amber-500 font-black text-sm">${book.price || "0"}</span>
                </div>
                
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-indigo-500 transition-colors">
                  {book.title}
                </h3>
                
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
                  By {book.author || "Unknown"}
                </p>
                
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 pt-1 min-h-[36px]">
                  {book.description || "No description provided for this asset."}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/60 mt-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                  {book.status || "Published"}
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                  Stock: <strong className="text-slate-700 dark:text-zinc-300 font-bold">{book.stockQuantity || 0}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}