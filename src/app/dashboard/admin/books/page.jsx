"use client";

import React from "react";
import { FiEyeOff, FiTrash2 } from "react-icons/fi";

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage All Marketplace Listings</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Administrative override command dashboard for book assets.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">Book Metadata</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Override Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              <tr className="hover:bg-zinc-800/10 transition-colors">
                <td className="py-3.5">
                  <p className="font-bold text-white">The Silent Patient</p>
                  <p className="text-[10px] text-zinc-500">Alex Michaelides</p>
                </td>
                <td className="py-3.5"><span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-md text-[9px] uppercase tracking-wide">Published</span></td>
                <td className="py-3.5 text-right space-x-2">
                  <button className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-md" title="Forcibly Hide"><FiEyeOff size={13} /></button>
                  <button className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-md"><FiTrash2 size={13} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}