"use client";

import React, { useState } from "react";
import { updateTicketStatus } from "@/lib/action/products";

const TicketTable = ({ tickets = [] }) => {
  const [ticketList, setTicketList] = useState(tickets);
  const [loadingAction, setLoadingAction] = useState(null);

  const updateStatus = async (id, status) => {
    try {
      setLoadingAction({ id, status });

      await updateTicketStatus(id, status);

      setTicketList((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket._id === id ? { ...ticket, status } : ticket,
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
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
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
            const isUpdating = loadingAction?.id === ticket._id;

            const isApproving =
              isUpdating && loadingAction?.status === "approved";

            const isRejecting =
              isUpdating && loadingAction?.status === "rejected";

            return (
              <tr key={ticket._id} className="border-t">
                <td className="p-3">
                  <p className="font-semibold">{ticket.title}</p>
                  <p className="text-sm text-gray-500">
                    {ticket.transportType}
                  </p>
                </td>

                <td className="p-3">
                  {ticket.fromLocation} → {ticket.toLocation}
                </td>

                <td className="p-3">৳{ticket.price}</td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      ticket.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status || "pending"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    {/* Approve Button */}
                    <button
                      onClick={() => updateStatus(ticket._id, "approved")}
                      disabled={isApproving || ticket.status === "approved"}
                      className="cursor-pointer rounded bg-green-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isApproving ? "Updating..." : "Approve"}
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => updateStatus(ticket._id, "rejected")}
                      disabled={isRejecting || ticket.status === "rejected"}
                      className="cursor-pointer rounded bg-red-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
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
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
