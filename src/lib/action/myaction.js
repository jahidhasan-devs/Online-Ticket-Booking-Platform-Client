"use server";
import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;


export const getMyTickets = async () => {
  try {
    const token = await getTokenServer();

    const res = await fetch(`${baseURl}/vendor/my-tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Get my tickets error:", error);
    return [];
  }
};


export const getVendorTicketById = async (id) => {
  try {
    const token = await getTokenServer();

    const response = await fetch(`${baseURl}/vendor/my-tickets/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Get ticket failed:", errorData.message);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Get vendor ticket error:", error);
    return null;
  }
};

export const updateVendorTicket = async (id, formData) => {
  try {
    const token = await getTokenServer();

    const response = await fetch(`${baseURl}/vendor/my-tickets/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message:
        data.message ||
        (response.ok ? "Ticket updated successfully" : "Update failed"),
    };
  } catch (error) {
    console.error("Update vendor ticket error:", error);

    return {
      success: false,
      message: "Server connection failed",
    };
  }
};

export const deleteVendorTicket = async (id) => {
  try {
    const token = await getTokenServer();

    const response = await fetch(`${baseURl}/vendor/my-tickets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message:
        data.message ||
        (response.ok ? "Ticket deleted successfully" : "Delete failed"),
    };
  } catch (error) {
    console.error("Delete vendor ticket error:", error);

    return {
      success: false,
      message: "Server connection failed",
    };
  }
};