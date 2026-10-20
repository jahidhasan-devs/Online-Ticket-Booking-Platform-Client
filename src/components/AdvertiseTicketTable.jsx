"use client";

import { advertiseTicket, unadvertiseTicket } from "@/lib/action/advertising";
import { useState } from "react";

const AdvertiseTicketTable = ({
  approvedTickets = [],
  advertisedTickets = [],
}) => {
  const [tickets] = useState(approvedTickets);

  const [advertisedIds, setAdvertisedIds] = useState(
    advertisedTickets.map((ticket) => String(ticket.ticketId)),
  );

  const [loadingId, setLoadingId] = useState(null);

  const handleAdvertise = async (ticket) => {
    const ticketId = String(ticket._id);

    if (loadingId) return;

    setLoadingId(ticketId);

    try {
      const result = await advertiseTicket(ticketId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setAdvertisedIds((previous) =>
        previous.includes(ticketId) ? previous : [...previous, ticketId],
      );

      alert("Ticket advertised successfully!");
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnadvertise = async (ticket) => {
    const ticketId = String(ticket._id);

    if (loadingId) return;

    setLoadingId(ticketId);

    try {
      const result = await unadvertiseTicket(ticketId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setAdvertisedIds((previous) => previous.filter((id) => id !== ticketId));

      alert("Ticket unadvertised successfully!");
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-neutral-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Manage Advertisements
        </h2>

        <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
          Advertised: {advertisedIds.length}/6
        </p>
      </div>

      {/* Responsive table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Ticket Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 dark:text-neutral-400"
                >
                  No approved tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket, index) => {
                const ticketId = String(ticket._id);
                const isAdvertised = advertisedIds.includes(ticketId);
                const isLoading = loadingId === ticketId;

                return (
                  <tr
                    key={ticketId}
                    className="border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-900/70"
                  >
                    <td className="px-4 py-3 text-gray-600 dark:text-neutral-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {ticket.title || "Untitled ticket"}
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-neutral-300">
                      ৳{ticket.price ?? "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          isAdvertised
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
                        }`}
                      >
                        {isAdvertised ? "Advertised" : "Not Advertised"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={Boolean(loadingId)}
                        onClick={() =>
                          isAdvertised
                            ? handleUnadvertise(ticket)
                            : handleAdvertise(ticket)
                        }
                        className={`cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          isAdvertised
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isLoading
                          ? "Please wait..."
                          : isAdvertised
                            ? "Unadvertise"
                            : "Advertise"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertiseTicketTable;
