"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiTruck, FiUsers, FiBookOpen, FiClock, FiActivity } from "react-icons/fi";

export default function PlatformLiveStats() {
  
  // রিক্রুটারদের জন্য বাস্তবসম্মত সিস্টেম ডাটা প্রোপজিশন
  const metrics = [
    {
      id: 1,
      stat: "24,850+",
      label: "Books Delivered",
      description: "Successfully dispatched and dropped right to readers' doorsteps.",
      icon: <FiTruck size={22} className="text-[#0091ff]" />,
      accentColor: "group-hover:border-[#0091ff]/30",
      glowBg: "bg-blue-50 text-[#0091ff]",
    },
    {
      id: 2,
      stat: "1,240+",
      label: "Library Nodes",
      description: "Verified local libraries and independent collectors actively sharing stock.",
      icon: <FiUsers size={22} className="text-purple-600" />,
      accentColor: "group-hover:border-purple-500/30",
      glowBg: "bg-purple-50 text-purple-600",
    },
    {
      id: 3,
      stat: "45,900+",
      label: "Active Catalog",
      description: "Premium titles listed by our network, ready for instant borrowing.",
      icon: <FiBookOpen size={22} className="text-emerald-600" />,
      accentColor: "group-hover:border-emerald-500/30",
      glowBg: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 4,
      stat: "38 Mins",
      label: "Avg. Delivery Time",
      description: "Optimized local routing ensures lightning fast book delivery dispatches.",
      icon: <FiClock size={22} className="text-amber-600" />,
      accentColor: "group-hover:border-amber-500/30",
      glowBg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section className="w-full bg-white text-slate-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-slate-100">
      
      {/* Background Pure Grid Pattern Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ================= Header Title Block ================= */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200/60 text-slate-600 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
            <FiActivity className="animate-pulse text-[#0091ff]" /> System Pulse
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Platform Metrics & Impact Stats
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Real-time infrastructure logs demonstrating the scale, delivery speed, and networking ecosystem of the BiblioDrop platform.
          </p>
        </div>

        {/* ================= 4-Column Responsive Grid ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {metrics.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-50/50 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative group shadow-sm ${item.accentColor}`}
            >
              <div className="space-y-4">
                {/* Icon Wrapper box */}
                <div className={`p-3 rounded-xl w-fit border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-300 ${item.glowBg}`}>
                  {item.icon}
                </div>

                {/* Counter & Meta */}
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-950 tracking-tight font-sans">
                    {item.stat}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider pt-0.5">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Sub-Decorative Minimal Accent Line */}
              <div className="w-0 h-[2px] bg-[#0091ff] absolute bottom-0 left-6 group-hover:w-[calc(100%-48px)] transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}