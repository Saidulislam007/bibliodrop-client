"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Login simulated successfully!");
    }, 1500);
  };

  // বামপাশের ব্যানার গ্রিডের ডামি ডাটা (PromoAI স্ক্রিনশট অনুযায়ী)
  const promoImages = [
    { id: 1, date: "Jun 01", title: "The Place", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300" },
    { id: 2, date: "Jun 02", title: "Wellness", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300" },
    { id: 3, date: "Jun 03", title: "Read More", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300" },
    { id: 4, date: "Jun 04", title: "Friday Vib", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=300" },
    { id: 5, date: "Jun 05", title: "Book Club", img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=300" },
    { id: 6, date: "Jun 06", title: "Discovery", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300" },
  ];

  return (
    // ফুল স্ক্রিন ২-কলাম গ্রিড লেআউট
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-950 min-h-[calc(100vh-64px)] w-full font-sans">
      
      {/* ==================== বাম কলাম: প্রমোশনাল ব্যানার ও কন্টেন্ট গ্রিড ==================== */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-center px-12 xl:px-20 bg-slate-50/50 dark:bg-zinc-900/30 border-r border-gray-100 dark:border-zinc-900 py-12 select-none">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
            NEW! Unleash BiblioDrop
          </span>
          <h1 className="text-4xl xl:text-5xl font-black text-slate-900 dark:text-zinc-50 tracking-tight mt-4 leading-[1.1]">
            Unleash The Power of <span className="text-indigo-600">Digital Library</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-4 text-base max-w-md">
            Get instant access to thousands of books from local libraries and independent owners tailored for your reading list in minutes!
          </p>

          {/* স্ক্রিনশটের মতো ডাইনামিক গ্রিড কার্ডস */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {promoImages.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-zinc-800 group"
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded-md">
                  {item.date}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ট্রাস্টপাইলট এবং অ্যাপ স্টোর ব্যাজ সিমুলেশন */}
          <div className="flex items-center gap-6 mt-10 pt-6 border-t border-gray-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-300">Excellent</span>
              <div className="flex text-emerald-500 text-xs">★★★★★</div>
              <span className="text-xs text-slate-400 font-medium">Trustpilot</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700"></div>
            <div className="text-xs font-bold text-slate-700 dark:text-zinc-400">
              Rating <span className="text-slate-900 dark:text-zinc-200 font-black">4.7/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ডান কলাম: রেসপনসিভ লগইন বক্স ==================== */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center px-4 sm:px-8 py-12 bg-white dark:bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          {/* হেডার টেক্সট */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-zinc-50 tracking-tight">
              Log in to your account
            </h2>
          </div>

          {/* সোশ্যাল মিডিয়া বাটন গ্রুপ */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 shadow-sm"
            >
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl text-sm transition-all shadow-sm"
            >
              <FaFacebook size={18} />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* ওআর / ডিভাইডার */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
            <span className="absolute bg-white dark:bg-zinc-950 px-3 text-xs text-slate-400 dark:text-zinc-500 font-medium">
              Or continue with email
            </span>
          </div>

          {/* লগইন ফর্ম এলিমেন্ট (লজিক এবং স্টেট সম্পূর্ণ ঠিক আছে) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-4 pr-11 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:text-zinc-500"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {/* ফ্ল্যাট পিঙ্ক/ম্যাজেন্টা আকর্ষনীয় সাবমিট বাটন (রেফারেন্স ইমেজ অনুযায়ী) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff3366] hover:bg-[#e62e5c] text-white font-bold rounded-full shadow-md shadow-red-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 mt-6"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* ফুটার লিংক গ্রুপ */}
          <div className="flex flex-col items-center justify-center gap-3 mt-6 text-sm font-medium">
            <Link href="/forgot-password" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
              Forgot password?
            </Link>
            <p className="text-slate-400 dark:text-zinc-500 text-xs">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-slate-700 dark:text-zinc-300 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}