"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiTruck, FiCompass, FiFolder, FiCheckSquare } from "react-icons/fi";

export default function CoreFeatures() {
  
  const featureCards = [
    {
      id: 1,
      role: "FOR READERS & STUDENTS",
      title: "Browse Books & Manage Reading Lists",
      description: "Explore thousands of titles from various categories. Effortlessly build your personal reading lists, check real-time availability, and track your ongoing reading progress.",
      icon: <FiCompass size={22} className="text-[#0091ff]" />,
      subFeatures: ["Category-based smart search", "Personalized reading list manager", "Live book availability tracking"],
      badgeColor: "bg-blue-50 text-[#0091ff] border-blue-100",
    },
    {
      id: 2,
      role: "SMART LOGISTICS",
      title: "On-Demand Doorstep Delivery",
      description: "Skip the hassle of visiting physical libraries. Select your favorite book and request doorstep delivery in seconds. Our integrated delivery system brings knowledge right to you.",
      icon: <FiTruck size={22} className="text-emerald-600" />,
      subFeatures: ["Seamless delivery request forms", "Real-time order status tracking", "Secure book return pipelines"],
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: 3,
      role: "FOR LIBRARIANS & OWNERS",
      title: "Library Inventory & Order Control",
      description: "A dedicated control panel designed for professional librarians and independent book owners. Instantly list your books, track current stocks, and approve delivery requests.",
      icon: <FiFolder size={22} className="text-purple-600" />,
      subFeatures: ["Easy inventory listing & updates", "Delivery request approval flow", "User rental history logs"],
      badgeColor: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    // 🛠️ মেইন কন্টেইনার এখন সম্পূর্ণ হোয়াইট (bg-white) এবং টেক্সট ডার্ক (text-slate-800)
    <section className="w-full bg-white text-slate-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-slate-100">
      
      {/* ব্যাকগ্রাউন্ডে একটি লাইট এবং সফট গ্রাফিক্স শেড */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ================= Header Section ================= */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            How <span className="text-[#0091ff]">BiblioDrop</span> Works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            A comprehensive digital ecosystem seamlessly connecting passionate readers and students with local libraries and independent book collectors.
          </p>
        </div>

        {/* ================= 3-Column Core Grid ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              // 🛠️ কার্ডগুলোর ব্যাকগ্রাউন্ড পিওর হোয়াইট এবং স্লিক বর্ডার-শ্যাডো দিয়ে সাজানো হয়েছে
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#0091ff]/40 hover:shadow-xl transition-all duration-300 relative group shadow-sm"
            >
              <div className="space-y-5">
                {/* Role Badge */}
                <span className={`inline-block text-[9px] font-extrabold tracking-widest border px-2.5 py-0.5 rounded-md ${card.badgeColor}`}>
                  {card.role}
                </span>

                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:scale-105 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#0091ff] transition-colors">
                    {card.title}
                  </h3>
                </div>

                {/* Main Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {card.description}
                </p>

                {/* Sub-features Checklist */}
                <ul className="space-y-2 pt-4 border-t border-slate-100">
                  {card.subFeatures.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <FiCheckSquare className="text-slate-300 group-hover:text-[#0091ff] transition-colors shrink-0" size={12} />
                      <span className="group-hover:text-slate-700 transition-colors">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}