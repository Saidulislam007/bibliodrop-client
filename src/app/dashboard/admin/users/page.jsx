"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage System Users</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Control global user tiers, memberships, and accounts.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3">User</th>
                <th className="pb-3">Role Status</th>
                <th className="pb-3 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
              <tr className="hover:bg-zinc-800/10 transition-colors">
                <td className="py-3.5">
                  <p className="font-bold text-white">Sarah Mitchell</p>
                  <p className="text-[10px] text-zinc-500">sarah@example.com</p>
                </td>
                <td className="py-3.5"><span className="text-indigo-400 font-extrabold tracking-wide uppercase text-[10px]">Librarian</span></td>
                <td className="py-3.5 text-right space-x-2">
                  <button className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md font-bold text-[10px]">Make Admin</button>
                  <button className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md"><FiTrash2 size={13} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}