"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteVendorTicket } from "@/lib/action/myaction";

const MyTicketsGrid = ({ tickets = [] }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black";
      case "rejected":
        return "border border-gray-300 bg-gray-100 text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400";
      default:
        return "border border-gray-300 bg-white text-gray-700 dark:border-neutral-600 dark:bg-neutral-900 dark:text-gray-300";
    }
  };

  const handleDelete = async (ticket) => {
    if (ticket.status === "rejected" || deletingId !== null) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${ticket.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(String(ticket._id));

    try {
      const result = await deleteVendorTicket(String(ticket._id));

      if (!result.success) {
        alert(result.message || "Failed to delete ticket.");
        return;
      }

      alert(result.message || "Ticket deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error("Delete ticket error:", error);
      alert("Something went wrong while deleting the ticket.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 bg-white dark:bg-black sm:grid-cols-2 lg:grid-cols-3">
      {tickets.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-black">
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            You have not added any tickets yet.
          </p>
        </div>
      ) : (
        tickets.map((ticket) => {
          const rejected = ticket.status === "rejected";
          const isDeleting = deletingId === String(ticket._id);
          const buttonsDisabled = rejected || deletingId !== null;

          return (
            <div
              key={String(ticket._id)}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-black hover:shadow-md dark:border-neutral-800 dark:bg-black dark:hover:border-white"
            >
              {ticket.image && (
                <img
                  src={ticket.image}
                  alt={ticket.title || "Ticket"}
                  className="h-48 w-full border-b border-gray-200 object-cover dark:border-neutral-800"
                />
              )}

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-black dark:text-white">
                    {ticket.title}
                  </h2>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      ticket.status,
                    )}`}
                  >
                    {ticket.status || "pending"}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span className="text-black dark:text-white">
                    {ticket.fromLocation}
                  </span>{" "}
                  →{" "}
                  <span className="text-black dark:text-white">
                    {ticket.toLocation}
                  </span>
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-sm dark:border-neutral-800">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      Transport
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {ticket.transportType || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      Price
                    </span>
                    <span className="font-semibold text-black dark:text-white">
                      {ticket.price != null ? `৳${ticket.price}` : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      Quantity
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {ticket.quantity ?? "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-neutral-800">
                  <Link
                    href={`/dashboard/vendor/${ticket._id}/edit`}
                    aria-disabled={buttonsDisabled}
                    tabIndex={buttonsDisabled ? -1 : 0}
                    onClick={(event) => {
                      if (buttonsDisabled) event.preventDefault();
                    }}
                    className={`rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition ${
                      buttonsDisabled
                        ? "pointer-events-none cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                    }`}
                  >
                    Update
                  </Link>

                  <button
                    type="button"
                    disabled={buttonsDisabled}
                    onClick={() => handleDelete(ticket)}
                    className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      buttonsDisabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-gray-300 bg-white text-black hover:border-black hover:bg-black hover:text-white dark:border-neutral-600 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyTicketsGrid;
