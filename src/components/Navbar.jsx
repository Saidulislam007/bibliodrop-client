"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ রাউটার রিফ্রেশ করার জন্য useRouter আনা হয়েছে
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, FiX, FiChevronDown, FiUser, 
  FiBookOpen, FiLogOut, FiLayout, FiShoppingBag,
  FiLogIn, FiUserPlus
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client"; // ✅ Better-Auth ক্লায়েন্ট ইম্পোর্ট করা হয়েছে

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  // ✅ Better-Auth থেকে রিয়াল সেশন ডেটা নেওয়া হচ্ছে
  const { data: session } = authClient.useSession();

  // ✅ ইউজারের রোল ডাইনামিকালি ট্র্যাক করা (ডিফল্ট ফলব্যাক হিসেবে 'reader' দেওয়া হয়েছে)
  const userRole = session?.user?.role || session?.user?.metadata?.role || "reader";

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

  // ✅ Better-Auth এর অফিশিয়াল সাইন-আউট মেথড
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsDropdownOpen(false);
      alert("Logged out successfully!");
      router.push("/login"); // লগআউটের পর লগইন পেজে রিডাইরেক্ট
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-black dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto bg-[#0d1117] dark:bg-zinc-900 border border-zinc-800 rounded-[20px] px-6 md:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between h-16">
          
          {/* ১. লোগো */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-indigo-500 rounded-lg text-white group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(79,70,229,0.3)]">
                <FiBookOpen size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                BiblioDrop
              </span>
            </Link>
          </div>

          {/* ২. ডেস্কটপ নেভিগেশন লিংক */}
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
                  className="relative px-4 py-2 rounded-xl text-sm font-sans font-semibold transition-colors duration-200 isolate select-none flex flex-col items-center justify-center h-10"
                >
                  <span className={`relative z-10 whitespace-nowrap transition-colors duration-200 ${
                    isActive || isHovered ? "text-white" : "text-zinc-400"
                  }`}>
                    {link.name}
                  </span>
                  
                  {isHovered && (
                    <motion.div 
                      layoutId="slidingNavPill"
                      className="absolute inset-0 bg-zinc-800/50 rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {isActive && !isHovered && (
                    <div className="absolute inset-0 bg-zinc-800/30 rounded-xl z-0" />
                  )}

                  {isHovered && (
                    <motion.div
                      layoutId="glowDotIndicator"
                      className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full z-10 shadow-[0_0_8px_#34d399]"
                      transition={{ type: "spring", stiffness: 380, damping: 25 }}
                    />
                  )}

                  {isActive && !isHovered && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full z-10 shadow-[0_0_8px_#34d399]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ৩. অথেনটিকেশন এরিয়া */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <AnimatePresence mode="wait">
              {/* ✅ ডামি ইউজার চেঞ্জ করে session চেক লজিক বসানো হয়েছে */}
              {session?.user ? (
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
                    className="flex items-center gap-2 p-1 py-1.5 rounded-full hover:bg-zinc-800/80 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  >
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name} 
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 ring-1 ring-zinc-700">
                        <FiUser size={14} />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-zinc-200 max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                    <FiChevronDown className={`text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-[#161b22] p-2 shadow-2xl border border-zinc-800 focus:outline-none"
                      >
                        <div className="px-3 py-2 mb-1.5">
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Role Base Portal</p>
                          <p className="text-xs font-bold text-indigo-400 capitalize mt-0.5">{userRole}</p>
                        </div>
                        
                        <div className="space-y-0.5">
                          {dashboardLinks[userRole]?.map((subLink) => (
                            <Link key={subLink.href} href={subLink.href} className="w-full">
                              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                                {subLink.icon} {subLink.name}
                              </button>
                            </Link>
                          ))}
                        </div>

                        <div className="my-1.5 border-t border-zinc-800" />
                        
                        <button 
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
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
                  className="flex items-center gap-4"
                >
                  <Link href="/login">
                    <button className="text-sm font-semibold text-zinc-300 hover:text-white transition-all">
                      Login
                    </button>
                  </Link>

                  <Link href="/register">
                    <button className="px-4 py-1.5 text-sm font-bold bg-[#f6f2ee] hover:bg-white text-zinc-950 rounded-lg shadow-md transition-all active:scale-95">
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
              className="p-2 text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ৫. মোবাইল ড্রয়ার */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 bg-[#0d1117] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-5 space-y-3">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block">
                    <span className={`block px-3 py-2 rounded-xl text-sm font-sans font-semibold ${
                      pathname === link.href ? "bg-zinc-800 text-white" : "text-zinc-400"
                    }`}>
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-zinc-800 my-2" />

              {/* ✅ মোবাইল ড্রয়ারেও ডাইনামিক সেশন চেক অ্যাড করা হয়েছে */}
              {session?.user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-zinc-900 rounded-xl flex items-center gap-3">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                        <FiUser size={18} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-zinc-200">{session.user.name}</p>
                      <p className="text-[10px] text-indigo-400 font-medium capitalize">{userRole} Account</p>
                    </div>
                  </div>
                  
                  <div className="space-y-0.5 pl-1">
                    {dashboardLinks[userRole]?.map((subLink) => (
                      <Link key={subLink.href} href={subLink.href} className="block">
                        <span className="flex items-center gap-3 px-3 py-2 text-zinc-400 rounded-lg text-xs font-medium">
                          {subLink.icon} {subLink.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/login" className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-200 font-bold rounded-xl hover:bg-zinc-800 transition-colors text-sm">
                      <FiLogIn size={14} /> Login
                    </button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-950 font-bold rounded-xl shadow-md text-sm">
                      <FiUserPlus size={14} /> Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}