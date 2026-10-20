"use server";
import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const fetchVendorRevenueStats = async () => {
  try {
    const token = await getTokenServer();
    console.log("Connecting to API:", `${baseURl}/vendor/revenue-stats`); // ডিবাগ করার জন্য

    const res = await fetch(`${baseURl}/vendor/revenue-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch revenue data.",
        status: res.status,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    // এখানে আসল সিস্টেম এররটি প্রিন্ট হবে
    console.error("Fetch vendor revenue request failed details:", error);

    return {
      success: false,
      message: `Connection error: ${error.message}`, // আসল এরর মেসেজ দেখাবে
    };
  }
};
