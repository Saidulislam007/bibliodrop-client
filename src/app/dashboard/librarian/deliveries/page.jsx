"use client";

import React, { useState, useEffect } from "react";
import { FiLoader, FiCheckCircle } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { getDeliveriesByEmail } from "@/lib/api/books";
import toast, { Toaster } from "react-hot-toast"; // 👈 react-hot-toast ইম্পোর্ট করা হলো ভাই

// 🟢 আপনার তৈরি করা অ্যাকশন ফাইল থেকে নতুন PATCH মেথডটি ইম্পোর্ট করা হলো ভাই
import { updateDeliveryStatus } from "@/lib/actions/books";

export default function ManageDeliveries() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  // 📢 image_88eee4.png এর মতো লাইট থিম নোটিফিকেশন ফাংশন ভাই
  const showNotification = (message, type = "success") => {
    const toastOptions = {
      style: {
        borderRadius: "9999px", // পিল শেপ বর্ডার
        background: "#ffffff",
        color: "#1f2937", // ডার্ক গ্রে টেক্সট
        border: "1px solid #e5e7eb", // হালকা গ্রে বর্ডার
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 16px",
      },
    };

    if (type === "success") {
      toast.success(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#10b981", // গ্রিন টিক মার্ক
          secondary: "#ffffff",
        },
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        iconTheme: {
          primary: "#ef4444", //  ক্রস মার্ক
          secondary: "#ffffff",
        },
      });
    }
  };

  useEffect(() => {
    const fetchAllDeliveries = async () => {
      try {
        setLoading(true);
        const data = await getDeliveriesByEmail(""); 
        setDeliveries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading system delivery registries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDeliveries();
  }, []);

  // 🔄 ডাটাবেজ এবং স্টেট একসাথে সিঙ্ক করে স্ট্যাটাস চেঞ্জ করার হ্যান্ডলার ভাই
  const handleNextStatus = async (id, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === "Pending") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Delivered";
    else return;

    try {
      statusLoadingId === null && setStatusLoadingId(id); // বাটন লোডার লক চালু হলো ভাই

      // 🟢 ১. ব্যাকঅ্যান্ড এক্সপ্রেস সার্ভারে PATCH রিকোয়েস্ট পাঠানো হলো
      const response = await updateDeliveryStatus(id, { deliveryStatus: nextStatus });

      if (response.success) {
        // ২. ডাটাবেজে সফলভাবে সেভ হলে তবেই ফ্রন্টঅ্যান্ড স্টেট আপডেট হবে ভাই
        setDeliveries(prev => 
          prev.map(item => item._id === id ? { ...item, deliveryStatus: nextStatus } : item)
        );
        showNotification(`🔄 Delivery status node synced to database: ${nextStatus}`, "success");
      } else {
        showNotification(`❌ Failed to update database node: ${response.message || "Unknown cluster error."}`, "error");
      }
    } catch (err) {
      console.error("Failed to update status node:", err);
      showNotification("❌ A network error occurred while updating drop status.", "error");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400 text-xs font-bold gap-2 animate-pulse">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        <span>LOADING SYSTEM DELIVERY REGISTRIES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 relative">
      
      {/* 🔮 React Hot Toaster - যা টোস্টকে ডান পাশে লাইট থিমে দেখাবে ভাই */}
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage Deliveries</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Update client order drop cycles smoothly.</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl py-12 text-center">
          <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">
            No client delivery requests pipeline detected.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Book Title</th>
                  <th className="pb-3">Delivery Fee</th>
                  <th className="pb-3">Book Price</th>
                  <th className="pb-3">Request Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Update Drop Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 text-xs">
                {deliveries.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-800/10 transition-colors">
                    
                    <td className="py-3.5 font-bold text-white capitalize">
                      {item.userName || "Unknown Client"}
                      <p className="text-[10px] text-zinc-500 font-medium normal-case">{item.userEmail}</p>
                    </td>
                    
                    <td className="py-3.5 text-zinc-400 font-medium capitalize flex items-center gap-2">
                      <img src={item.image} alt={item.title} className="w-7 h-9 object-cover rounded bg-zinc-950 border border-zinc-800/50" />
                      <span className="truncate max-w-[150px] sm:max-w-xs">{item.title}</span>
                    </td>
                    
                    <td className="py-3.5 font-bold text-amber-500">
                      ${item.fee?.toFixed(2) || "0.00"}
                    </td>

                    <td className="py-3.5 font-semibold text-zinc-400">
                      ${item.price || "0"}
                    </td>
                    
                    <td className="py-3.5 text-zinc-500 font-medium">{formatDate(item.requestedAt)}</td>
                    
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 border font-bold rounded-md text-[9px] uppercase tracking-wide inline-flex items-center gap-1 ${statusColors[item.deliveryStatus || "Pending"]}`}>
                        {(item.deliveryStatus === "Pending" || !item.deliveryStatus) && <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />}
                        {item.deliveryStatus || "Pending"}
                      </span>
                    </td>
                    
                    <td className="py-3.5 text-right">
                      {(item.deliveryStatus || "Pending") !== "Delivered" ? (
                        <button 
                          onClick={() => handleNextStatus(item._id, item.deliveryStatus || "Pending")} 
                          disabled={statusLoadingId === item._id}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg font-bold text-[11px] border border-zinc-700 transition-all active:scale-95"
                        >
                          {statusLoadingId === item._id ? "Syncing..." : `Mark as ${(item.deliveryStatus || "Pending") === "Pending" ? "Dispatched" : "Delivered"}`}
                        </button>
                      ) : (
                        <span className="text-emerald-500 text-[11px] font-black inline-flex items-center gap-1 pr-2">
                          <FiCheckCircle size={12} /> Lifecycle Completed
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}