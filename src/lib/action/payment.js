"use server";

import { getTokenServer } from "../getTokenServer";
import { auth } from "../auth";
import { headers } from "next/headers";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const subscription = async (data) => {
  try {
    const res = await fetch(`${baseURl}/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    return resData;
  } catch (error) {
    console.error("Subscription action error:", error);
    return { success: false, error: error.message };
  }
};

// ====================== POST Payment to Backend ======================
export const payment = async (data) => {
  let backendResponse = null;

  // 1. POST payment data to Backend API (/payment)
  try {
    const token = await getTokenServer().catch(() => null);

    const res = await fetch(`${baseURl}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    backendResponse = await res.json().catch(() => ({}));
  } catch (error) {
    console.error("Payment backend API error:", error);
  }

  // 2. Also ensure payment record is saved in MongoDB "payments" collection
  try {
    const { MongoClient } = await import("mongodb");
    if (process.env.MONGODB_URI) {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db("ticket-booking-platform");

      // Check if this payment is already recorded to avoid duplicates
      const existing = await db.collection("payments").findOne({
        $or: [
          { session_id: data.session_id },
          ...(data.transactionId ? [{ transactionId: data.transactionId }] : []),
        ],
      });

      if (!existing) {
        await db.collection("payments").insertOne({
          ...data,
          createdAt: new Date(),
        });
      }

      await client.close();
    }
  } catch (dbErr) {
    console.error("MongoDB payment record error:", dbErr);
  }

  return backendResponse || { success: true };
};

// ====================== GET Payment History from Backend ======================
export const getPaymentHistory = async () => {
  // 1. Try Backend API GET endpoints
  try {
    const token = await getTokenServer().catch(() => null);
    const session = await auth.api.getSession({
      headers: await headers(),
    }).catch(() => null);

    const userEmail = session?.user?.email;
    const emailQuery = userEmail ? `?email=${encodeURIComponent(userEmail)}` : "";

    const headersList = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const endpoints = [
      `${baseURl}/payment${emailQuery}`,
      `${baseURl}/payments${emailQuery}`,
      `${baseURl}/user/payments${emailQuery}`,
      `${baseURl}/user/my-payments${emailQuery}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: headersList,
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            return { success: true, data };
          }
          if (data && Array.isArray(data.data)) {
            return { success: true, data: data.data };
          }
        }
      } catch (_) {}
    }
  } catch (apiErr) {
    console.warn("Backend get payments API error:", apiErr);
  }

  // 2. Direct database query from MongoDB "payments" collection
  try {
    const { MongoClient } = await import("mongodb");
    if (process.env.MONGODB_URI) {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db("ticket-booking-platform");

      const records = await db
        .collection("payments")
        .find({})
        .sort({ createdAt: -1, _id: -1 })
        .toArray();

      await client.close();

      return {
        success: true,
        data: records.map((r) => ({
          ...r,
          _id: r._id.toString(),
        })),
      };
    }
  } catch (dbErr) {
    console.error("MongoDB get payments error:", dbErr);
  }

  return { success: false, data: [] };
};
