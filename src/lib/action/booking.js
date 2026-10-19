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