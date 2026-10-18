"use server";
import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;



export const addTicket = async (ticketPayload) => {
  try {
    const token = await getTokenServer();

    const res = await fetch(`${baseURl}/vendor/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketPayload),
    });

    const data = await res.json();

    // Backend error হলে error object return করবে
    // ইচ্ছাকৃত rejection-এর জন্য throw করবে না
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create ticket.",
        status: res.status,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("Add ticket request failed:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
    };
  }
};




export const updateTicketStatus = async (id, status) => {
  const token = await getTokenServer();

  const res = await fetch(`${baseURl}/admin/tickets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Ticket status update failed");
  }

  return data;
};