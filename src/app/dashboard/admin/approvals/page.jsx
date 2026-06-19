"use client";

import React from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Book Approval Queue</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Review and approve new librarian submittals.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">Title</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Fee</th>
                <th className="pb-3">Librarian</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              <tr className="hover:bg-zinc-800/10 transition-colors">
                <td className="py-3.5 font-bold text-white">Voluptatibus dolor q</td>
                <td className="py-3.5">Fuga Quaerat commod</td>
                <td className="py-3.5"><span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-md">History</span></td>
                <td className="py-3.5 font-semibold text-emerald-400">$30.00</td>
                <td className="py-3.5 text-zinc-400">James Rodriguez</td>
                <td className="py-3.5 text-right space-x-2">
                  <button className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg font-bold text-[11px] transition-all">Approve</button>
                  <button className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all"><FiTrash2 size={13} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}