"use client";

import React, { useState, useEffect } from "react";
import { FiTrash2, FiLoader, FiUser } from "react-icons/fi";
import { getUsers, deleteUser, updateUserRole } from "@/lib/api/users"; // 📢 নতুন অ্যাকশনটি ইম্পোর্ট করা হলো

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

  // 🛡️ রোল চেঞ্জ হ্যান্ডলার (ডাটাবেজ ও ইউআই রিয়েল-টাইম সিঙ্ক)
  const handleRoleChange = async (userId, targetRole, userName) => {
    try {
      // ব্যাকএন্ড অ্যাকশন কল করে ডাটাবেজে রোল আপডেট করা
      const result = await updateUserRole(userId, { role: targetRole });

      if (
        result?.success || 
        result?.modifiedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert(`🎉 Success! ${userName}'s role updated to ${targetRole}.`);
        
        // সফলভাবে ডাটাবেজে সেভ হলে ক্লায়েন্ট সাইড UI স্টেট আপডেট করা হলো
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: targetRole } : user
        ));
      } else {
        alert(`❌ Failed: ${result?.message || "Could not update user role."}`);
      }
    } catch (error) {
      console.error("Error during role update:", error);
      alert("❌ A network error occurred while updating the database.");
    }
  };

  // 🗑️ ইউজার ডিলিট হ্যান্ডলার
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to permanently delete account: "${userName}"?`)) {
      return; 
    }

    try {
      const result = await deleteUser(userId);

      if (
        result?.success || 
        result?.deletedCount > 0 || 
        result?.acknowledged === true
      ) {
        alert(`🗑️ Removed! "${userName}" has been successfully deleted.`);
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
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">
              No registered user records found in the database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="pb-4 pl-2">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Joined</th>
                  <th className="pb-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs sm:text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-900/30 transition-colors">
                    
                    {/* ১. ইউজার কলাম */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <FiUser size={14} />
                        </div>
                        <span className="font-bold text-white tracking-tight">{user.name || "Anonymous User"}</span>
                      </div>
                    </td>

                    {/* ২. ইমেইল কলাম */}
                    <td className="py-4 text-zinc-400 font-medium">{user.email}</td>

                    {/* ৩. রোল কলাম */}
                    <td className="py-4">
                      <select 
                        value={user.role || "user"} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value, user.name || "User")}
                        className="px-4 py-1.5 bg-white border border-zinc-200 text-zinc-900 rounded-full font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-md transition-all appearance-none pr-8 relative style-select"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2318181b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 8px center",
                          backgroundSize: "14px"
                        }}
                      >
                        <option value="user" className="bg-zinc-900 text-white font-medium">User</option>
                        <option value="admin" className="bg-zinc-900 text-white font-medium">Admin</option>
                        <option value="librarian" className="bg-zinc-900 text-white font-medium">Librarian</option>
                      </select>
                    </td>

                    {/* ৪. জয়েনিং ডেট কলাম */}
                    <td className="py-4 text-zinc-400 font-medium">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : "Jun 20, 2026"
                      }
                    </td>

                    {/* ৫. অ্যাকশন কলাম */}
                    <td className="py-4 text-center">
                      {user.email !== "said38383742@gmail.com" ? (
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="p-2 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      ) : (
                        <span className="w-8 h-8 block mx-auto text-[10px] text-zinc-600 font-bold flex items-center justify-center">Owner</span> 
                      )}
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