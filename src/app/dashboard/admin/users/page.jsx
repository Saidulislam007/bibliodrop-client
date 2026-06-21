"use client";

import React, { useState, useEffect } from "react";
import { FiTrash2, FiLoader } from "react-icons/fi";
import { getUsers, deleteUser } from "@/lib/api/users"; // 📢 ডিলিট অ্যাকশনটি এখানে ইম্পোর্ট করা হলো

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 ডাটাবেজ থেকে সব ইউজার ফেচ করা
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const data = await getUsers("", ""); 

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data?.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error loading system users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  // রোল চেঞ্জ হ্যান্ডলার
  const handleToggleRole = (id, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    
    setUsers(users.map(user => 
      user._id === id ? { ...user, role: nextRole } : user
    ));
    
    alert(`🎉 User role successfully updated to ${nextRole}`);
  };

  // 🗑️ ডিলিট ইউজার হ্যান্ডলার (ডাটাবেজ ও ইউআই রিয়েল-টাইম সিঙ্ক)
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to permanently delete account: "${userName}"?`)) {
      return; // ইউজার ক্যানসেল করলে ফাংশন এখানেই স্টপ হবে
    }

    try {
      // ব্যাকএন্ড ডিলিট অ্যাকশন কল করা হলো
      const result = await deleteUser(userId);

      if (
        result?.success || 
        result?.deletedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert(`🗑️ Removed! "${userName}" has been successfully deleted from the database.`);
        // সফলভাবে ডিলিট হলে ইউআই স্টেট থেকে ফিল্টার করে ইনস্ট্যান্ট রিমুভ করা হলো
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert(`❌ Delete Failed: ${result?.message || "Could not remove user account."}`);
      }
    } catch (error) {
      console.error("Error during user deletion:", error);
      alert("❌ A network error occurred while updating the database.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-zinc-400">
        <FiLoader size={24} className="animate-spin text-indigo-500" />
        <p className="text-xs font-semibold tracking-wider">LOADING USER INFRASTRUCTURE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage System Users</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Control global user tiers, memberships, and accounts.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-md">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">
              No registered user records found in the database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role Status</th>
                  <th className="pb-3 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="py-3.5">
                      <p className="font-bold text-white">{user.name || "Anonymous User"}</p>
                      <p className="text-[10px] text-zinc-500">{user.email}</p>
                    </td>
                    <td className="py-3.5">
                      <span className={`font-extrabold tracking-wide uppercase text-[10px] ${
                        user.role === 'admin' 
                          ? "text-amber-400" 
                          : user.role === 'librarian' 
                          ? "text-indigo-400" 
                          : "text-zinc-400"
                      }`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className={`px-2 py-1 rounded-md font-bold text-[10px] border transition-all ${
                          user.role === 'admin'
                            ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                            : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {user.role === "admin" ? "Demote User" : "Make Admin"}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md transition-colors active:scale-90"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}