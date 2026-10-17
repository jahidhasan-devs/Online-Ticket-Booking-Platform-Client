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
