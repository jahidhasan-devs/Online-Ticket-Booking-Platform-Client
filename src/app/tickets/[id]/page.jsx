
// app/tickets/[id]/page.jsx

import Image from "next/image";
import Link from "next/link";
import { getTicketById } from "@/lib/api/product";
import TicketBookingSection from "@/components/TicketBookingSection";

export default async function TicketDetailsPage({ params }) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  // Ticket Not Found
  if (!ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center text-gray-900 transition-colors dark:bg-gray-950 dark:text-white">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <svg
            className="h-10 w-10 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold sm:text-3xl">
          Ticket Not Found
        </h2>

        <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400">
          The ticket you are looking for does not exist or has been removed.
        </p>

        <Link
          href="/tickets"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Browse All Tickets
        </Link>
      </div>
    );
  }

  const available = Number(ticket.quantity) > 0;

  const departureDate = ticket.departureDateTime
    ? new Date(ticket.departureDateTime)
    : null;

  const validDepartureDate =
    departureDate && !Number.isNaN(departureDate.getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-colors duration-300 dark:bg-gray-950">
      <div className="container mx-auto max-w-6xl px-4">

        {/* Back Button */}
        <Link
          href="/tickets"
          className="mb-6 inline-flex items-center gap-2 rounded-lg font-medium text-blue-600 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          Back to All Tickets
        </Link>

        {/* Main Ticket Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Ticket Image */}
            <div className="relative min-h-[320px] bg-gray-100 sm:min-h-[450px] dark:bg-gray-800">
              {ticket.image ? (
                <Image
                  src={ticket.image}
                  alt={ticket.title || "Ticket image"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex min-h-[320px] h-full items-center justify-center sm:min-h-[450px]">
                  <div className="text-center">
                    <svg
                      className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 11l5-5 4 4 3-3 6 6M9 8h.01"
                      />
                    </svg>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No image available
                    </p>
                  </div>
                </div>
              )}

              {/* Image Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  {ticket.transportType || "Transport"}
                </span>
              </div>
            </div>

            {/* Right: Ticket Details */}
            <div className="flex flex-col p-5 sm:p-7 lg:p-8">

              {/* Title */}
              <div className="mb-5">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Ticket Details
                </p>

                <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl dark:text-white">
                  {ticket.title}
                </h1>
              </div>

              {/* Route */}
              <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Journey Route
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="break-words font-semibold text-gray-900 dark:text-gray-100">
                        {ticket.fromLocation}
                      </span>

                      <span className="text-gray-400">→</span>

                      <span className="break-words font-semibold text-gray-900 dark:text-gray-100">
                        {ticket.toLocation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/40">
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ticket Price
                </p>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-700 sm:text-4xl dark:text-blue-400">
                    ৳{ticket.price}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / seat
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Seat Availability
                </p>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    available
                      ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      available ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  {available
                    ? `${ticket.quantity} seats available`
                    : "Sold Out"}
                </span>
              </div>

              {/* Departure Date & Time */}
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <svg
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    Departure Date & Time
                  </p>

                  <p className="font-semibold leading-6 text-gray-800 dark:text-gray-200">
                    {validDepartureDate
                      ? departureDate.toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {/* Perks */}
              {ticket.perks && ticket.perks.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Included Perks
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {ticket.perks.map((perk, index) => (
                      <span
                        key={`${perk}-${index}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400"
                      >
                        <svg
                          className="h-4 w-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>

                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Information */}
              {ticket.vendorName && (
                <div className="mb-6 flex items-center gap-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>

                  <span className="text-gray-500 dark:text-gray-400">
                    Sold by:
                  </span>

                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {ticket.vendorName}
                  </span>
                </div>
              )}

              {/* Booking Section */}
              <div className="mt-auto border-t border-gray-200 pt-6 dark:border-gray-800">
                <TicketBookingSection ticket={ticket} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Book your seat now and enjoy a comfortable journey.
          </p>
        </div>

      </div>
    </div>
  );
}
