"use client";

import React, { useEffect, useState } from "react";
import { fetchVendorRevenueStats } from "@/lib/action/revenue"; // আপনার পাথ অনুযায়ী চেক করে নিন

export default function VendorRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    totalBookings: 0,
    recentTransactions: [],
  });

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        setLoading(true);
        const result = await fetchVendorRevenueStats();

        if (result.success) {
          setStats(result.data || {});
        } else {
          setError(result.message || "ডেটা লোড করতে সমস্যা হয়েছে।");
        }
      } catch (err) {
        setError("অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        ডেটা লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-base font-medium">
        ত্রুটি: {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          রেভিনিউ ওভারভিউ
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          আপনার সমস্ত টিকেট বিক্রয়ের আয় ও বুকিং সংক্রান্ত বিস্তারিত তথ্য
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            মোট রেভিনিউ
          </span>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ৳ {(stats?.totalRevenue || 0).toLocaleString()}
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            মোট সফল বুকিং
          </span>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats?.totalBookings || 0} টি
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            আজকের আয়
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ৳ {(stats?.todayRevenue || 0).toLocaleString()}
          </div>
        </div>

        {/* This Month's Revenue */}
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            এই মাসের আয়
          </span>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ৳ {(stats?.monthRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            সাম্প্রতিক ট্রানজ্যাকশন
          </h2>
        </div>

        {!stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 font-medium">
            কোনো রেভিনিউ নেই
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">টিকেট নাম</th>
                  <th className="py-3 px-4">কাস্টমার ইমেইল</th>
                  <th className="py-3 px-4">অ্যামাউন্ট</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                {stats.recentTransactions.map((item) => (
                  <tr
                    key={item?._id || Math.random()}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/55 transition"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(
                        item?.createdAt || item?.paymentDate || Date.now(),
                      ).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {item?.ticketTitle || item?.title || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                      {item?.userEmail || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      ৳{" "}
                      {Number(
                        item?.amount || item?.price || 0,
                      ).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
                        {item?.status || "paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
