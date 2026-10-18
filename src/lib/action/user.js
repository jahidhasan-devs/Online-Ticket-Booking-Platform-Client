"use server";

import { getTokenServer } from "@/lib/getTokenServer";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Get all users
export const getAllUsers = async () => {
  const token = await getTokenServer();

  if (!token) throw new Error("Please login again.");

  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

// Same route for Admin, Vendor and Fraud
export const updateUserRole = async (userId, role) => {
  const token = await getTokenServer();

  if (!token) throw new Error("Please login again.");

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
    throw new Error(data.message || data.msg || "Failed to update user");
  }

  return data;
};

// Fraud action also uses the same route
export const markVendorAsFraud = async (userId) => {
  return updateUserRole(userId, "fraud");
};
