"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reader"); // ডিফল্ট রোল 'reader'
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Express backend API Integration
    // const res = await axios.post('/api/auth/register', { name, email, password, role });

    setTimeout(() => {
      setIsLoading(false);
      alert(`Registration success as ${role}!`);
    }, 1500);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-zinc-800"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Join BiblioDrop community marketplace today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiUser size={18} />
              </span>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiMail size={18} />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Join Account As</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
            >
              <option value="reader">Reader / Student (Buy/Borrow Books)</option>
              <option value="provider">Librarian / Independent Book Owner</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiLock size={18} />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none pt-3"
          >
            {isLoading ? "Creating Account..." : <><FiUserPlus size={18} /> Register Now</>}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}