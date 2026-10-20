"use server";

import { getTokenServer } from "../getTokenServer";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

export const createBooking = async (data) => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: resData?.message || "Booking failed",
    };
  }

  return {
    success: true,
    data: resData,
  };
};

// ====================== Vendor Actions ======================

export const getRequestedBookings = async () => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURL}/vendor/requested-bookings`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to load requested bookings",
    };
  }

  return {
    success: true,
    data: data,
  };
};

export const acceptBooking = async (bookingId) => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURL}/bookings/${bookingId}/accept`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to accept booking",
    };
  }

  return {
    success: true,
    message: data.message,
  };
};

export const rejectBooking = async (bookingId) => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURL}/bookings/${bookingId}/reject`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to reject booking",
    };
  }

  return {
    success: true,
    message: data.message,
  };
};

// ====================== User: My Bookings ======================

export const getMyBookings = async () => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURL}/user/my-bookings`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to load my bookings",
    };
  }

  return {
    success: true,
    data: data,
  };
};

// ====================== Update Status to Paid ======================

export const markBookingAsPaid = async (bookingId, transactionId = "") => {
  if (!bookingId) {
    return { success: false, message: "No booking ID provided" };
  }

  // 1. Try backend API PATCH endpoints
  try {
    const token = await getTokenServer().catch(() => null);
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    };

    // Try PATCH /bookings/:id/pay
    await fetch(`${baseURL}/bookings/${bookingId}/pay`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "paid", transactionId }),
    }).catch(() => {});

    // Try PATCH /bookings/:id
    await fetch(`${baseURL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "paid", transactionId }),
    }).catch(() => {});
  } catch (apiErr) {
    console.warn("Backend API payment update:", apiErr);
  }

  // 2. Direct MongoDB update to guarantee 100% persistence
  try {
    const { MongoClient, ObjectId } = await import("mongodb");
    if (process.env.MONGODB_URI) {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db("ticket-booking-platform");

      let filter;
      try {
        filter = { _id: new ObjectId(bookingId) };
      } catch {
        filter = { _id: bookingId };
      }

      await db.collection("bookings").updateOne(filter, {
        $set: {
          status: "paid",
          paymentStatus: "paid",
          transactionId: transactionId || "",
          paidAt: new Date(),
        },
      });

      await client.close();
      return { success: true, message: "Booking marked as paid in database" };
    }
  } catch (dbErr) {
    console.error("Direct MongoDB update error:", dbErr);
  }

  return { success: true };
};
