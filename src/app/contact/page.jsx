"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiEdit3, FiMapPin, FiSend, FiMessageSquare } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Message dispatched to BiblioDrop Core successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const quickChannels = [
    { id: 1, text: "hi@daily.dev", href: "mailto:hi@daily.dev", icon: <FiMail /> },
    { id: 2, text: "Feedback Center", href: "#", icon: <FiEdit3 /> },
    { id: 3, text: "Dhaka, Bangladesh", href: "#", icon: <FiMapPin /> },
  ];

  return (
    // মেইন কন্টেইনার (লগইন/রেজিস্টার থিমের সাথে ম্যাচ রেখে কিলার স্প্লিট ভিউ)
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-black dark:bg-zinc-950 min-h-[calc(100vh-64px)] w-full font-sans overflow-hidden">
      
      {/* ==================== বাম কলাম: ব্র্যান্ড হিরো প্যানেল (নতুন ইউনিক লুক) ==================== */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between px-12 xl:px-16 bg-white dark:bg-zinc-900 rounded-r-[120px] xl:rounded-r-[150px] py-16 select-none z-10 shadow-[25px_0_50px_rgba(0,0,0,0.3)]">
        <div className="my-auto space-y-6 max-w-sm mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider">
            <FiMessageSquare className="animate-bounce" /> WE ARE LIVE
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Let's build something <span className="text-indigo-600">together.</span>
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Have a question about our marketplace, licensing, or need custom deployment? Drop us a message, our team will respond within 24 hours.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Average response time: 4 mins</span>
            </div>
          </div>
        </div>

        {/* নিচের স্লিক কপিরাইট বা ব্র্যান্ড ফুটনোট */}
        <p className="text-xs text-slate-400 text-center font-medium">
          BiblioDrop Enterprise &bull; Support Core
        </p>
      </div>

      {/* ==================== ডান কলাম: লাইভ মেসেজিং ওয়ার্কস্পেস (সম্পূর্ণ ইউনিক ফাংশনাল UI) ==================== */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-black text-white relative">
        <div className="w-full max-w-[460px] space-y-8 z-10">
          
          {/* হেডার টেক্সট */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Drop us a line
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">
              Fill out the form below and hook directly into our system.
            </p>
          </div>

          {/* মেইন কন্ট্যাক্ট ফর্ম এলিমেন্ট */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm focus:outline-none transition-all text-white placeholder:text-zinc-600 font-medium"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm focus:outline-none transition-all text-white placeholder:text-zinc-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help you expand your library?"
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm focus:outline-none transition-all text-white placeholder:text-zinc-600 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] disabled:opacity-70 text-sm"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <FiSend size={14} /> <span>Send Message</span>
                </>
              )}
            </button>
          </form>

          {/* ওআর / ডিভাইডার */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-zinc-900"></div>
            <span className="absolute bg-black px-3 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
              Quick Channels
            </span>
          </div>

          {/* ৩টি কুইক কন্ট্যাক্ট মেথড বাটন (স্লিক ক্যাপসুল লুক) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quickChannels.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900/40 border border-zinc-800/60 rounded-full text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200"
              >
                <span className="text-zinc-500 group-hover:text-white">{channel.icon}</span>
                <span>{channel.text}</span>
              </a>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}