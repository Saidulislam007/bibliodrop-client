"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, FiX, FiChevronDown, FiUser, 
  FiBookOpen, FiLogOut, FiLayout, FiShoppingBag,
  FiLogIn, FiUserPlus
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // হভার ট্র্যাক করার স্টেট
  const [hoveredPath, setHoveredPath] = useState(null);

  // ডামি ইউজার স্টেট
  const [user, setUser] = useState({
    name: "Ahmed Rafe",
    email: "rafe@bibliodrop.com",
    role: "provider", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
  });

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("#user-dropdown-wrapper")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Books", href: "/browse" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  const dashboardLinks = {
    reader: [
      { name: "My Profile", href: "/dashboard/profile", icon: <FiUser /> },
      { name: "My Orders", href: "/dashboard/orders", icon: <FiShoppingBag /> },
    ],
    provider: [
      { name: "Librarian Panel", href: "/dashboard/provider", icon: <FiLayout /> },
      { name: "Manage Books", href: "/dashboard/books", icon: <FiBookOpen /> },
    ],
    admin: [
      { name: "Admin Core", href: "/dashboard/admin", icon: <FiLayout /> },
      { name: "All Users", href: "/dashboard/users", icon: <FiUser /> },
    ],
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">
          
          {/* ১. লোগো */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white group-hover:scale-105 transition-transform">
                <FiBookOpen size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                BiblioDrop
              </span>
            </Link>
          </div>

          {/* ২. ডেস্কটপ নেভিগেশন লিংক (আগের font-sans এবং text-style ফিরিয়ে আনা হয়েছে + Neon Glow Dot) */}
          <div 
            className="hidden md:flex items-center gap-1 h-full"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const isHovered = hoveredPath === link.href;

              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  // 🛠️ ফিক্সড: আপনার আগের font-sans এবং প্রিমিয়াম টাইপোগ্রাফি ফিরিয়ে আনা হয়েছে
                  className="relative px-4 py-2 rounded-xl text-sm font-sans font-semibold transition-colors duration-200 isolate select-none flex flex-col items-center justify-center h-10 group/item"
                >
                  {/* লিংক টেক্সট কালার স্টাইল */}
                  <span className={`relative z-10 whitespace-nowrap transition-colors duration-200 ${
                    isActive || isHovered 
                      ? "text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-600 hover:text-slate-900 dark:text-zinc-400"
                  }`}>
                    {link.name}
                  </span>
                  
                  {/* কাস্টম স্লাইডিং ক্যাপসুল ব্যাকগ্রাউন্ড */}
                  {isHovered && (
                    <motion.div 
                      layoutId="slidingNavPill"
                      className="absolute inset-0 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* একটিভ রুট ব্যাকগ্রাউন্ড লক ফলব্যাক */}
                  {isActive && !isHovered && (
                    <div className="absolute inset-0 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl z-0" />
                  )}

                  {/* Neon Glow Dot Indicator */}
                  {isHovered && (
                    <motion.div
                      layoutId="glowDotIndicator"
                      className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full z-10 shadow-[0_0_8px_#4f46e5] dark:shadow-[0_0_8px_#818cf8]"
                      transition={{ type: "spring", stiffness: 380, damping: 25 }}
                    />
                  )}

                  {/* একটিভ রুটের জন্য ডটের স্থায়ী পজিশন */}
                  {isActive && !isHovered && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full z-10 shadow-[0_0_8px_#4f46e5] dark:shadow-[0_0_8px_#818cf8]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ৩. অথেনটিকেশন এরিয়া */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div 
                  key="user-logged-in"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative" 
                  id="user-dropdown-wrapper"
                >
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/20"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <FiChevronDown className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-zinc-800 p-2 shadow-xl border border-gray-100 dark:border-zinc-700 focus:outline-none"
                      >
                        <div className="px-3 py-2 mb-1.5">
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role Base Portal</p>
                          <p className="text-xs font-bold text-indigo-600 capitalize mt-0.5">{user.role}</p>
                        </div>
                        
                        <div className="space-y-0.5">
                          {dashboardLinks[user.role]?.map((subLink) => (
                            <Link key={subLink.href} href={subLink.href} className="w-full">
                              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-zinc-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-slate-900 transition-colors">
                                {subLink.icon} {subLink.name}
                              </button>
                            </Link>
                          ))}
                        </div>

                        <div className="my-1.5 border-t border-gray-100 dark:border-zinc-700" />
                        
                        <button 
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-danger rounded-xl hover:bg-danger/10 transition-colors"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="user-logged-out"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <Link href="/login">
                    <button className="px-4 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-all">
                      Login
                    </button>
                  </Link>

                  <Link href="/register">
                    <button className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-indigo-200 transition-all active:scale-95">
                      Register
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ৪. হ্যামবার্গার বাটন */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* ৫. মোবাইল ড্রয়ার */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 overflow-hidden shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block">
                    {/* মোবাইল ভিউতেও আগের font-sans ফিরিয়ে আনা হয়েছে */}
                    <span className={`block px-3 py-2.5 rounded-xl text-base font-sans font-semibold ${
                      pathname === link.href ? "bg-indigo-50 text-indigo-600" : "text-slate-600 dark:text-zinc-300"
                    }`}>
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 my-2" />

              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{user.name}</p>
                      <p className="text-xs text-indigo-600 font-medium capitalize">{user.role} Account</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pl-2">
                    {dashboardLinks[user.role]?.map((subLink) => (
                      <Link key={subLink.href} href={subLink.href} className="block">
                        <span className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-zinc-400 rounded-xl text-sm font-medium">
                          {subLink.icon} {subLink.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-danger font-medium rounded-xl hover:bg-danger/5 transition-colors"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/login" className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                      <FiLogIn size={16} /> Login
                    </button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-sm">
                      <FiUserPlus size={16} /> Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}