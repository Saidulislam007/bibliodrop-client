"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiAlertOctagon } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট ভাই */}
      <div className="absolute w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[120px] top-1/4 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="text-center space-y-6 max-w-md z-10">
        {/* ৪MD মোশন অ্যানিমেটেড আইকন */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-16 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2"
        >
          <FiAlertOctagon size={24} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            404
          </h1>
          <h2 className="text-lg font-bold text-zinc-200 tracking-tight uppercase">
            Pipeline Registry Vacant
          </h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            The targeted navigation node asset does not exist or has been permanently wiped from the core architecture.
          </p>
        </motion.div>

        {/* ব্যাক টু হোম বাটন */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pt-2"
        >
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white font-bold text-xs px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 border border-zinc-800/80 shadow-lg"
            >
              <FiHome size={14} />
              <span>Return to Core Pipeline</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}