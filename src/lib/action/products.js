"use server";
import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const addTicket = async (ticketPayload) => {
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
  return data;
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