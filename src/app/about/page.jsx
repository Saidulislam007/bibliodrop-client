"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiTruck, FiUsers, FiShield, FiTrendingUp } from "react-icons/fi";

export default function AboutPage() {
  
  // স্ক্রিনশটের মতো অল্টারনেটিভ গ্রিড লেআউটের জন্য ডাটা স্ট্রাকচার
  const features = [
    {
      id: 1,
      title: "Our Mission: Book Delivery for Everyone",
      description: "At BiblioDrop, our goal is simple yet impactful: we want to bridge the gap between avid readers and local knowledge hubs. Whether you are a student looking for academic references or a fiction lover diving into a new universe, we make sure logistics never stand in the way of your next great read.",
      icon: <FiTruck size={40} className="text-indigo-600" />,
      alignLeft: true,
    },
    {
      id: 2,
      title: "Empowering Local Librarians & Owners",
      description: "We don't just deliver books; we empower the community. Our advanced Librarian Panel allows local library owners and independent book collectors to list their inventories, track rentals, and manage requests effortlessly. It's a decentralized network built to keep local library cultures alive and thriving.",
      icon: <FiUsers size={40} className="text-indigo-600" />,
      alignLeft: false, // ডানপাশে ইমেজ/আইকন এবং বামপাশে টেক্সট যাবে
    },
    {
      id: 3,
      title: "Secure, Structured & Scalable Protocols",
      description: "Security and data integrity are at the core of our infrastructure. BiblioDrop utilizes modern MERN architecture ensuring lightning-fast client rorouting and heavily encrypted end-to-end delivery confirmation records. You can request, track, and enjoy your books with complete peace of mind.",
      icon: <FiShield size={40} className="text-indigo-600" />,
      alignLeft: true,
    },
  ];

  return (
    <div className="w-full mt-[-65] bg-white text-slate-800 font-sans min-h-screen selection:bg-indigo-500 selection:text-white">
      
      {/* ==================== ১. টপ হিরো ব্যানার সেকশন (স্ক্রিনশটের পার্পল ভাইব ও কার্ভ) ==================== */}
      <div className="w-full bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 lg:pt-30 text-center relative border-b-8 border-indigo-600/20">
        {/* ব্যাকগ্রাউন্ড সূক্ষ্ম গ্লো */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#693975] via-[#522d5b] to-[#401f48] -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            About us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-purple-100 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            We are <span className="font-extrabold text-white underline decoration-indigo-400 underline-offset-4">BiblioDrop</span> and our mission is seamless knowledge distribution for everyone! We power decentralized book discovery and automated doorstep deliveries for thousands of active readers. Pretty awesome, right?
          </motion.p>
        </div>
      </div>

      {/* ==================== ২. অল্টারনেটিভ গ্রিড ফিচারস সেকশন (হুবহু স্ক্রিনশট লেআউট) ==================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24 sm:space-y-32">
        {features.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* কন্ডিশনাল অর্ডারিং: রেসপনসিভ পজিশন ঠিক রেখে ডেক্সটপে অল্টারনেটিভ অ্যালাইনমেন্ট */}
            <div className={`col-span-1 lg:col-span-4 flex justify-center ${item.alignLeft ? "lg:order-first" : "lg:order-last"}`}>
              {/* স্ক্রিনশটের সার্কেল ফ্ল্যাগ/ব্রেন শেপের মতো মডার্ন গ্লাস আইকন কন্টেইনার */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner relative group hover:bg-white hover:border-indigo-100 transition-all duration-300">
                <div className="absolute inset-0 bg-indigo-50/30 rounded-full scale-90 group-hover:scale-105 transition-transform duration-500 blur-sm" />
                <div className="z-10 bg-white p-5 rounded-2xl shadow-md border border-slate-100 transition-transform group-hover:scale-110 duration-300">
                  {item.icon}
                </div>
              </div>
            </div>

            {/* টেক্সট কন্টেন্ট কলাম */}
            <div className="col-span-1 lg:col-span-8 space-y-4 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {item.title}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      

    </div>
  );
}