"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBookOpen, FiArrowRight, FiFacebook, 
  FiInstagram, FiLinkedin, FiCheck, FiAlertCircle 
} from "react-icons/fi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  const companyLinks = [
    { name: "Browse Books", href: "/browse" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "About Us", href: "/about" },
    { name: "Contact Support", href: "/contact" },
  ];

  const serveLinks = [
    { name: "Reader Portal", href: "/dashboard/profile" },
    { name: "Librarian Panel", href: "/dashboard/provider" },
    { name: "Enterprise Hub", href: "/enterprise" },
    { name: "Academic Delivery", href: "/academic" },
  ];

  const socialLinks = [
    { icon: <FiInstagram size={16} />, href: "#", label: "Instagram" },
    { icon: <FiFacebook size={16} />, href: "#", label: "Facebook" },
    { icon: <FiLinkedin size={16} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full bg-black text-zinc-400 font-sans select-none border-t border-zinc-900/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= ৪-কলাম মডার্ন SaaS গ্রিড লেআউট ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 pb-16">
          
          {/* ১. প্রথম কলাম: ব্র্যান্ড প্রোফাইল ও সোশ্যালস */}
          <div className="lg:col-span-3 space-y-12">
            <Link href="/" className="flex items-center gap-2 group focus:outline-none" aria-label="BiblioDrop Home">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white transition-transform group-hover:scale-105">
                <FiBookOpen size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                BiblioDrop
              </span>
            </Link>

            {/* স্ক্রিনশটের মতো বামদিকের সোশ্যাল লিংকস */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Follow BiblioDrop</p>
              <div className="flex items-center gap-4 text-zinc-500">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="hover:text-white transition-colors focus:outline-none"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ২. দ্বিতীয় কলাম: Our Company লিডারশিপ গ্রুপ */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white tracking-wide mb-5">Our Company</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-500 font-medium">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors focus:outline-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. তৃতীয় কলাম: Who We Serve পোর্টালস গ্রুপ */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white tracking-wide mb-5">Who We Serve</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-500 font-medium">
              {serveLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors focus:outline-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৪. চতুর্থ কলাম: স্ক্রিনশটের মতো মিনিমালিস্ট নিউজলেটার সাবস্ক্রিপশন */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                Subscribe to our newsletter
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Get the latest property data insights, reports, and more.
              </p>
            </div>

            {/* স্ক্রিনশট স্টাইল সোজা আন্ডারলাইন ইনপুট এবং রাইট অ্যারো বাটন */}
            <form onSubmit={handleSubscribe} className="relative pt-2">
              <div className="flex items-center border-b border-zinc-700 focus-within:border-white transition-colors pb-1.5">
                <input
                  type="email"
                  required
                  disabled={status === "success"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Email"
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-zinc-600 font-medium disabled:opacity-50"
                  aria-label="Email address for subscription"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="text-zinc-400 hover:text-white transition-colors p-1 focus:outline-none shrink-0"
                  aria-label="Submit email"
                >
                  {status === "loading" ? (
                    <span className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-white rounded-full animate-spin block" />
                  ) : (
                    <FiArrowRight size={16} />
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-semibold text-emerald-400" role="alert">
                  Subscribed successfully!
                </motion.p>
              )}
              {status === "error" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-semibold text-red-400" role="alert">
                  Invalid email format.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ================= ৫. বটমলাইন বার: কপিরাইট ও লিগ্যালস ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-900 text-xs text-zinc-500 font-medium">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} BiblioDrop CoreLogic, Inc. All Rights Reserved
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-zinc-500" aria-label="Legal Navigation">
            <Link href="/legal" className="hover:text-white transition-colors focus:outline-none">Legal</Link>
            <Link href="/privacy" className="hover:text-white transition-colors focus:outline-none">Privacy Policy</Link>
            <Link href="/ccpa" className="hover:text-white transition-colors focus:outline-none">CCPA</Link>
            <Link href="/dpf" className="hover:text-white transition-colors focus:outline-none">DPF</Link>
            <button className="hover:text-white transition-colors focus:outline-none text-left">Cookie Preferences</button>
          </nav>
        </div>

      </div>
    </footer>
  );
}