"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiEdit3, FiMapPin, FiPhone } from "react-icons/fi";

export default function ContactPage() {
  
  const contactCards = [
    {
      id: 1,
      title: "Email us",
      description: "Shoot us an email at hi@daily.dev and we'll get right back to you.",
      icon: <FiMail size={32} className="text-slate-800 dark:text-zinc-100" />,
      actionText: "hi@daily.dev",
      actionHref: "mailto:hi@daily.dev",
      lineColor: "bg-[#4facfe]" 
    },
    {
      id: 2,
      title: "Give us feedback",
      description: "Send us your feedback on our product and help us improve your experience.",
      icon: <FiEdit3 size={32} className="text-[#ffb300]" />, 
      actionText: "feedback center",
      actionHref: "#",
      lineColor: "bg-[#ffb300]" 
    },
    {
      id: 3,
      title: "Post address",
      description: "Daily Dev Ltd. 9 Derech Hatikva Street, Ganei Tikva, Israel 5591252",
      icon: <FiMapPin size={32} className="text-slate-800 dark:text-zinc-100" />,
      actionText: "+1 (323) 524 2318",
      actionHref: "tel:+13235242318",
      lineColor: "bg-[#7f00ff]" 
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 px-4 py-16 sm:py-24 w-full select-none font-sans min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl w-full">
        
        {/* 🛠️ ১. হেডার সেকশন (বোল্ড Contact Us হেডিং সহ) */}
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2d3748] dark:text-white">
            Contact Us
          </h1>
          <p className="text-[#4a5568] dark:text-zinc-300 text-sm sm:text-base max-w-xl mx-auto font-medium tracking-tight">
            Have any questions? Need to say hi? We'd love to hear from you.
          </p>
        </div>

        {/* ২. ৩-কলাম ইনফরমেশন গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20 items-start">
          {contactCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center w-full"
            >
              {/* আইকন হোল্ডার */}
              <div className="mb-6 flex items-center justify-center h-12">
                {card.icon}
              </div>

              {/* টাইটেল */}
              <h3 className="text-base font-bold text-[#2d3748] dark:text-zinc-200 tracking-tight mb-4">
                {card.title}
              </h3>

              {/* ডেসক্রিপশন */}
              <p className="text-[#718096] dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-[260px] text-center mb-5 font-normal h-12">
                {card.description}
              </p>

              {/* অ্যাকশন লিংক / ফোন নম্বর সেকশন */}
              <div className="mb-14 text-center">
                {card.id === 3 ? (
                  <a 
                    href={card.actionHref}
                    className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4a5568] dark:text-zinc-400 hover:text-indigo-600 transition-colors"
                  >
                    <FiPhone size={12} className="text-[#e53e3e]" />
                    {card.actionText}
                  </a>
                ) : (
                  <a 
                    href={card.actionHref}
                    className="text-xs sm:text-sm font-semibold text-[#4a5568] dark:text-zinc-400 hover:text-indigo-600 underline underline-offset-4 decoration-slate-300 dark:decoration-zinc-700 hover:decoration-indigo-500 transition-colors"
                  >
                    {card.actionText}
                  </a>
                )}
              </div>

              {/* ৩. সিগনেচার বটম অ্যাকসেন্ট লাইন */}
              <div className="w-full h-[1.2px] bg-slate-100 dark:bg-zinc-800 relative">
                <div className={`absolute inset-0 ${card.lineColor} opacity-75`} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}