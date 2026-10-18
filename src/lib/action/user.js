"use server";
import { getTokenServer } from "@/lib/getTokenServer";
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// সব user fetch
export const getAllUsers = async () => {
  const token = await getTokenServer();

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.msg || "Failed to fetch users");
  }

  return data;
};




// Role update
export const updateUserRole = async (userId, role) => {
  const token = await getTokenServer();

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.msg || "Failed to update role");
  }

  return data;
};

// Mark vendor as fraud
export const markVendorAsFraud = async (userId) => {
  const token = await getTokenServer();

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const response = await fetch(`${API_URL}/admin/users/${userId}/fraud`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isFraud: true }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.msg || "Failed to mark vendor as fraud",
    );
  }

  return data;
};
