"use client";

import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  markVendorAsFraud,
} from "@/lib/action/user";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = async (user, action) => {
    const id = String(user._id);

    if (loadingId) return;
    if (action === "fraud" && user.role !== "vendor") return;
    if (action === "fraud" && user.isFraud) return;
    if (action === user.role) return;

    const confirmed = window.confirm(
      action === "fraud"
        ? `Mark ${user.name || user.email} as a fraud vendor?`
        : `Change ${user.name || user.email}'s role to ${action}?`,
    );

    if (!confirmed) return;

    setLoadingId(id);
    setError("");
    setSuccess("");

    try {
      if (action === "fraud") {
        await markVendorAsFraud(id);
      } else {
        await updateUserRole(id, action);
      }

      setUsers((previous) =>
        previous.map((item) => {
          if (String(item._id) !== id) return item;

          if (action === "fraud") {
            return { ...item, isFraud: true };
          }

          return { ...item, role: action };
        }),
      );

      setSuccess(
        action === "fraud"
          ? "Vendor marked as fraud successfully."
          : `Role updated to ${action} successfully.`,
      );
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoadingId("");
    }
  };

  const admins = users.filter((user) => user.role === "admin").length;
  const vendors = users.filter((user) => user.role === "vendor").length;
  const frauds = users.filter((user) => user.isFraud === true).length;

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage user roles and vendor fraud status.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{admins}</p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Vendors</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">{vendors}</p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Fraud Vendors</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{frauds}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {users.length} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">#</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Fraud Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => {
                  const id = String(user._id);
                  const isFraud = user.isFraud === true;
                  const isLoading = loadingId === id;

                  return (
                    <tr key={id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {user.name || "Unnamed User"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {user.email || "No email"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isFraud
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isFraud ? "Fraud" : "Normal"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleUpdate(user, "admin")}
                            disabled={
                              Boolean(loadingId) || user.role === "admin"
                            }
                            className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isLoading ? "Updating..." : "Make Admin"}
                          </button>

                          <button
                            onClick={() => handleUpdate(user, "vendor")}
                            disabled={
                              Boolean(loadingId) || user.role === "vendor"
                            }
                            className="cursor-pointer rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Make Vendor
                          </button>

                          {user.role === "vendor" && (
                            <button
                              onClick={() => handleUpdate(user, "fraud")}
                              disabled={Boolean(loadingId) || isFraud}
                              className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isLoading
                                ? "Updating..."
                                : isFraud
                                  ? "Marked as Fraud"
                                  : "Mark as Fraud"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
