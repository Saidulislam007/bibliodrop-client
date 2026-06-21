"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // কাস্টম টোস্ট নোটিফিকেশন স্টেট
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // টোস্ট দেখানোর হেল্পার ফাংশন
  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // ✅ ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending registration data to Better-Auth...");

      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        role: role, // ✅ মেটাডেটা বাদ দিয়ে সরাসরি role পাস করা হলো
        metadata: {
          role: role // ✅ ওল্ড স্ট্রাকচার ব্যাকআপের জন্য মেটাডাটায়ও role পাঠানো হলো
        },
        disableAutoLogin: true
      });

      if (error) {
        console.error("❌ Better-Auth Signup Error Details:", error.message);
        showNotification(error.message || "Please check your inputs.", "error");
        setIsLoading(false);
        return;
      }

      console.log("Registration Success Data:", data);

      // রেজিস্ট্রেশনের পর ব্রাউজারের লোকাল সেশন ক্যাশ সম্পূর্ণ ক্লিয়ার করা হলো
      await authClient.signOut({
        redirect: false
      });

      // কাস্টম সাকসেস টোস্ট মেসেজ
      showNotification(`🎉 Success! Account created successfully as a ${role === 'reader' ? 'Reader' : 'Librarian'}.`, "success");

      // ব্রাউজার যেন ক্যাশ থেকে ডেটা পুশ করতে না পারে, সেজন্য ফর্মটিকে সম্পূর্ণ হার্ড রিসেট করা হলো
      e.target.reset();

      // রিয়্যাক্ট স্টেটগুলো খালি (Reset) করে দেওয়া হলো
      setName("");
      setEmail("");
      setPassword("");
      setRole("reader");
      setIsLoading(false);

      // সেশন ফ্রি করে ইউজারকে ফ্রেশভাবে লগইন পেজে পাঠানো হচ্ছে
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 2000);

    } catch (err) {
      console.error("Catch Block Triggered:", err);
      showNotification("A network error occurred. Please check your server status.", "error");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log("Initiating Google Sign-Up...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/login"
      });
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
    }
  };

  const promoImages = [
    { id: 1, date: "Jun 01", title: "Read Free", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300" },
    { id: 2, date: "Jun 02", title: "Share Books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300" },
    { id: 3, date: "Jun 03", title: "Local Hub", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300" },
    { id: 4, date: "Jun 04", title: "Community", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=300" },
    { id: 5, date: "Jun 05", title: "Smart Order", img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=300" },
    { id: 6, date: "Jun 06", title: "Reporter Panel", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300" },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-black dark:bg-zinc-950 min-h-[calc(100vh-64px)] w-full font-sans relative">

      {/* 🔔 FRAMER MOTION CUSTOM TOAST UI */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md pointer-events-auto ${toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
            >
              {toast.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
              <p className="text-xs font-bold tracking-wide leading-relaxed">{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* বাম কলাম: রেজিস্ট্রেশন ফর্ম */}
      <div className="col-span-1 lg:col-span-6 flex flex-col justify-center items-center px-4 sm:px-8 py-10 bg-white lg:bg-black text-slate-900 lg:text-white order-last lg:order-first transition-colors duration-300">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[360px]">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 lg:text-white tracking-tight">Create your account</h2>
          </div>

          <div className="space-y-2.5 mb-5">
            <button type="button" onClick={handleGoogleSignUp} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl text-sm transition-all border border-gray-200 lg:border-none shadow-sm">
              <FcGoogle size={18} /> <span>Sign up with Google</span>
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl text-sm transition-all shadow-sm">
              <FaFacebook size={18} /> <span>Sign up with Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="w-full border-t border-gray-200 lg:border-zinc-800"></div>
            <span className="absolute bg-white lg:bg-black px-3 text-xs text-zinc-400 lg:text-zinc-500 font-medium">Or register with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="none">
            <div className="space-y-1">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" autoComplete="new-name" className="w-full px-4 py-2.5 bg-slate-50 lg:bg-zinc-900 border border-slate-200 lg:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 lg:text-white placeholder:text-slate-400 lg:placeholder:text-zinc-500 font-medium" />
            </div>
            <div className="space-y-1">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" autoComplete="new-email" className="w-full px-4 py-2.5 bg-slate-50 lg:bg-zinc-900 border border-slate-200 lg:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 lg:text-white placeholder:text-slate-400 lg:placeholder:text-zinc-500 font-medium" />
            </div>
            <div className="space-y-1 relative">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-4 pr-10 py-2.5 bg-slate-50 lg:bg-zinc-900 border border-slate-200 lg:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 lg:text-white font-medium cursor-pointer appearance-none">
                <option value="user">Reader / Student (Buy & Borrow)</option>
                <option value="librarian">Librarian / Book Owner (List Books)</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 lg:text-zinc-500 pointer-events-none text-xs">▼</span>
            </div>
            <div className="space-y-1 relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" className="w-full pl-4 pr-11 py-2.5 bg-slate-50 lg:bg-zinc-900 border border-slate-200 lg:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 lg:text-white placeholder:text-slate-400 lg:placeholder:text-zinc-500 font-medium" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 lg:text-zinc-500 hover:text-slate-600 lg:hover:text-zinc-300">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff3366] hover:bg-[#e62e5c] text-white font-bold rounded-full shadow-md transition-all active:scale-[0.98] disabled:opacity-70 mt-5 text-sm">
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="flex flex-col items-center justify-center gap-3 mt-5 text-sm font-medium">
            <p className="text-slate-400 lg:text-zinc-500 text-xs">
              Already have an account? <Link href="/login" className="font-bold text-slate-700 lg:text-zinc-300 hover:underline">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ডান কলাম: ব্যানার ইমেজ গ্রিড */}
      <div className="hidden lg:flex lg:col-span-6 flex-col justify-center px-10 xl:px-16 bg-white dark:bg-zinc-900 rounded-l-[120px] xl:rounded-l-[150px] py-10 select-none z-10 order-first lg:order-last">
        <div className="max-w-xl mx-auto w-full">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">START YOUR JOURNEY TODAY</span>
          <h1 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-zinc-50 tracking-tight mt-4 leading-[1.15]">Join The Ultimate <span className="text-indigo-600 dark:text-indigo-400">Book Marketplace</span></h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-3 text-xs xl:text-sm leading-relaxed max-w-md">Create an account to connect with local libraries, rent your favorite titles, or list your own collection for others to borrow.</p>
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            {promoImages.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 group">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">{item.date}</div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6">
                  <p className="text-white text-[10px] font-bold truncate">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}