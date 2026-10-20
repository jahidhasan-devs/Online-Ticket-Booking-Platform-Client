"use client";

import React, { useState } from "react";
import { updateTicketStatus } from "@/lib/action/products";

const TicketTable = ({ tickets = [] }) => {
  const [ticketList, setTicketList] = useState(tickets);
  const [loadingAction, setLoadingAction] = useState(null);

  const updateStatus = async (id, status) => {
    if (loadingAction) return;

    try {
      setLoadingAction({ id, status });

      await updateTicketStatus(id, status);

      setTicketList((previousTickets) =>
        previousTickets.map((ticket) =>
          String(ticket._id) === String(id) ? { ...ticket, status } : ticket,
        ),
      );

      alert("Status successfully updated");
    } catch (error) {
      alert(error.message || "Ticket status update failed");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="p-3">Ticket</th>
              <th className="p-3">Route</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {ticketList.map((ticket) => {
              const ticketId = String(ticket._id);
              const isUpdating = loadingAction?.id === ticketId;

              const isApproving =
                isUpdating && loadingAction?.status === "approved";

              const isRejecting =
                isUpdating && loadingAction?.status === "rejected";

              return (
                <tr
                  key={ticketId}
                  className="border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-900/70"
                >
                  <td className="p-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {ticket.title || "Untitled ticket"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {ticket.transportType || "N/A"}
                    </p>
                  </td>

                  <td className="p-3 text-gray-700 dark:text-neutral-300">
                    {ticket.fromLocation || "N/A"} →{" "}
                    {ticket.toLocation || "N/A"}
                  </td>

                  <td className="p-3 text-gray-800 dark:text-neutral-200">
                    ৳{ticket.price ?? "N/A"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${
                        ticket.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : ticket.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                      }`}
                    >
                      {ticket.status || "pending"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(ticket._id, "approved")}
                        disabled={
                          Boolean(loadingAction) || ticket.status === "approved"
                        }
                        className="cursor-pointer whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isApproving ? "Updating..." : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(ticket._id, "rejected")}
                        disabled={
                          Boolean(loadingAction) || ticket.status === "rejected"
                        }
                        className="cursor-pointer whitespace-nowrap rounded-lg bg-red-600 px-3 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRejecting ? "Updating..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {ticketList.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500 dark:text-neutral-400"
                >
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
