"use client";

import React, { useEffect, useState } from "react";
import { fetchVendorRevenueStats } from "@/lib/action/revenue"; // আপনার পাথ অনুযায়ী চেক করে নিন

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
          // ডেটা সেফলি সেট করা
          setStats(result.data || {});
        } else {
          setError(result.message || "ডেটা লোড করতে সমস্যা হয়েছে।");
        }
      } catch (err) {
        setError("অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">রেভিনিউ ওভারভিউ</h1>
        <p className="text-sm text-gray-500">
          আপনার সমস্ত টিকেট বিক্রয়ের আয় ও বুকিং সংক্রান্ত বিস্তারিত তথ্য
        </p>
      </div>

      {/* Cards Section (এখানে `?.` এবং `|| 0` দিয়ে ক্র্যাশ প্রটেক্ট করা হয়েছে) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            মোট রেভিনিউ
          </span>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            ৳ {(stats?.totalRevenue || 0).toLocaleString()}
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            মোট সফল বুকিং
          </span>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {stats?.totalBookings || 0} টি
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            আজকের আয়
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ৳ {(stats?.todayRevenue || 0).toLocaleString()}
          </div>
        </div>

        {/* This Month's Revenue */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            এই মাসের আয়
          </span>
          <div className="mt-2 text-2xl font-bold text-indigo-600">
            ৳ {(stats?.monthRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            সাম্প্রতিক ট্রানজ্যাকশন
          </h2>
        </div>

        {!stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            কোনো রেভিনিউ নেই
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">টিকেট নাম</th>
                  <th className="py-3 px-4">কাস্টমার ইমেইল</th>
                  <th className="py-3 px-4">অ্যামাউন্ট</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {stats.recentTransactions.map((item) => (
                  <tr
                    key={item?._id || Math.random()}
                    className="hover:bg-gray-50/50 transition"
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
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {item?.ticketTitle || item?.title || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {item?.userEmail || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ৳{" "}
                      {Number(
                        item?.amount || item?.price || 0,
                      ).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 uppercase">
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
