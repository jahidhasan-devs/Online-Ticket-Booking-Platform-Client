"use server"
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