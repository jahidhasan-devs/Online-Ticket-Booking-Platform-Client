"use client";

import Link from "next/link";

const AdvertisementSection = ({ tickets = [] }) => {
  if (tickets.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl rounded-2xl bg-white px-4 py-10 text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <h2 className="mb-6 border-b border-gray-200 pb-3 text-2xl font-bold tracking-tight text-gray-900 dark:border-neutral-800 dark:text-white">
        Featured Tickets
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.slice(0, 6).map((ticket) => (
          <div
            key={String(ticket.ticketId || ticket._id)}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-400 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
          >
            {ticket.image && (
              <div className="overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title || "Ticket"}
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <div className="space-y-3 p-5">
              <h3 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
                {ticket.title}
              </h3>

              <div className="space-y-1.5 text-sm text-gray-600 dark:text-neutral-400">
                <p className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Price:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ৳{ticket.price ?? "N/A"}
                  </span>
                </p>

                <p className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Quantity:
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    {ticket.quantity ?? "N/A"}
                  </span>
                </p>

                <p className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Transport:
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    {ticket.transportType || "N/A"}
                  </span>
                </p>

                <div className="border-t border-gray-200 pt-2 dark:border-neutral-900">
                  <span className="mb-1 block text-gray-500 dark:text-neutral-500">
                    Perks:
                  </span>
                  <span className="text-xs text-gray-600 dark:text-neutral-300">
                    {Array.isArray(ticket.perks)
                      ? ticket.perks.join(", ")
                      : ticket.perks || "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/tickets/${ticket.ticketId || ticket._id}`}
                  className="block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  See details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvertisementSection;
