
"use server"

import { getTokenServer } from "../getTokenServer";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
export const advertiseTicket = async (ticketId) => {
  try {
    const token = await getTokenServer();

    const res = await fetch(`${baseURL}/admin/advertised-tickets/${ticketId}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to advertise ticket",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Advertise action error:", error);

    return {
      success: false,
      message: "Server connection failed",
    };
  }
};

export const unadvertiseTicket = async (ticketId) => {
  try {
    const token = await getTokenServer();

    const res = await fetch(`${baseURL}/admin/advertised-tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to unadvertise ticket",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Unadvertise action error:", error);

    return {
      success: false,
      message: "Server connection failed",
    };
  }
};
