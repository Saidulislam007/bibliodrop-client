"use client";

import React from "react";
import Link from "next/link";

export default function MobileNavbar({ menuItems, pathname }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-2 py-2 flex items-center justify-around lg:hidden z-50 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-16">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.name} href={item.href} className="flex-1 max-w-[85px] group">
            <span className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold tracking-tight transition-all duration-200 ${
              isActive
                ? "text-black scale-105"
                : "text-slate-400 hover:text-slate-900"
            }`}>
              <span className={`transition-transform duration-200 ${isActive ? "text-black scale-110" : "text-slate-400 group-hover:scale-105"}`}>
                {item.icon}
              </span>
              <span className="truncate max-w-full">{item.name.split(" ")[0]}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}