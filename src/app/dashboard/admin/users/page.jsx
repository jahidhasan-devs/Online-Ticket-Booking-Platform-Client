"use client";

import {
  getAllUsers,
  markVendorAsFraud,
  updateUserRole,
} from "@/lib/action/user";
import { authClient } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        (value || "").toLowerCase().includes(keyword),
      ),
    );
  }, [users, search]);

  const handleRoleChange = async (user, role) => {
    if (
      loadingId ||
      String(user._id) === String(currentUserId) ||
      user.role === role ||
      user.isFraud
    ) {
      return;
    }

    if (
      role === "admin" &&
      !window.confirm(`Make ${user.name || user.email} an admin?`)
    ) {
      return;
    }

    try {
      setLoadingId(String(user._id));
      setError("");
      setSuccess("");

      await updateUserRole(user._id, role);

      setUsers((previous) =>
        previous.map((item) =>
          String(item._id) === String(user._id) ? { ...item, role } : item,
        ),
      );

      setSuccess(`Role changed to ${role} successfully.`);
    } catch (err) {
      setError(err.message || "Role update failed");
    } finally {
      setLoadingId("");
    }
  };

  const handleFraud = async (user) => {
    if (loadingId || user.role !== "vendor" || user.isFraud) {
      return;
    }

    const confirmed = window.confirm(
      `Mark ${user.name || user.email} as a fraud vendor?`,
    );

    if (!confirmed) return;

    try {
      setLoadingId(String(user._id));
      setError("");
      setSuccess("");

      await markVendorAsFraud(user._id);

      setUsers((previous) =>
        previous.map((item) =>
          String(item._id) === String(user._id)
            ? { ...item, isFraud: true }
            : item,
        ),
      );

      setSuccess("Vendor marked as fraud successfully.");
    } catch (err) {
      setError(err.message || "Failed to mark vendor as fraud");
    } finally {
      setLoadingId("");
    }
  };

  const admins = users.filter((user) => user.role === "admin").length;

  const vendors = users.filter((user) => user.role === "vendor").length;

  const fraudVendors = users.filter(
    (user) => user.role === "vendor" && user.isFraud,
  ).length;

  const roleStyle = (role) => {
    if (role === "admin") {
      return "bg-black text-white dark:bg-white dark:text-black";
    }

    if (role === "vendor") {
      return "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100";
    }

    return "border border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300";
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            ADMIN DASHBOARD / USERS
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">Manage Users</h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage user roles and control vendor accounts.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Users", value: users.length },
            { label: "Administrators", value: admins },
            { label: "Vendors", value: vendors },
            { label: "Fraud Vendors", value: fraudVendors },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">All Users</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredUsers.length} user(s) found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, role..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-black dark:focus:border-white sm:w-72"
              />

              <button
                onClick={loadUsers}
                disabled={loading || Boolean(loadingId)}
                className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-900"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mx-5 mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mx-5 mt-5 rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              {success}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const role = user.role || "buyer";
                    const isFraud = user.isFraud === true;
                    const isBusy = loadingId === String(user._id);

                    // Current logged-in admin's own account
                    const isOwnAccount =
                      Boolean(currentUserId) &&
                      String(user._id) === String(currentUserId);

                    const roleButtonDisabled =
                      Boolean(loadingId) || isOwnAccount || isFraud;

                    return (
                      <tr
                        key={String(user._id)}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-900/60"
                      >
                        <td className="px-6 py-5 text-gray-500">{index + 1}</td>

                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {user.name || "Unnamed User"}
                            {isOwnAccount && (
                              <span className="ml-2 text-xs font-normal text-gray-500">
                                (You)
                              </span>
                            )}
                          </p>

                          {isFraud && (
                            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                              Fraud vendor
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyle(role)}`}
                          >
                            {role}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleRoleChange(user, "admin")}
                              disabled={roleButtonDisabled || role === "admin"}
                              title={
                                isOwnAccount
                                  ? "You cannot change your own role"
                                  : "Make Admin"
                              }
                              className="cursor-pointer rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                              {isBusy ? "Updating..." : "Make Admin"}
                            </button>

                            <button
                              onClick={() => handleRoleChange(user, "vendor")}
                              disabled={roleButtonDisabled || role === "vendor"}
                              title={
                                isOwnAccount
                                  ? "You cannot change your own role"
                                  : "Make Vendor"
                              }
                              className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-900"
                            >
                              Make Vendor
                            </button>

                            {role === "vendor" && (
                              <button
                                onClick={() => handleFraud(user)}
                                disabled={Boolean(loadingId) || isFraud}
                                className="cursor-pointer rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                              >
                                {isFraud ? "Marked as Fraud" : "Mark as Fraud"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-5 py-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Only authorized administrators can manage user roles.
          </div>
        </section>
      </div>
    </main>
  );
}
