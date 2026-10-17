// app/tickets/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getTicketById } from "@/lib/api/product"; // adjust path if needed
import TicketBookingSection from "@/components/TicketBookingSection"; // client component

const TicketDetailsPage = async ({ params }) => {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Ticket Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          The ticket you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/tickets"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700"
        >
          Browse All Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/tickets"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Image */}
            <div className="relative h-80 lg:h-auto min-h-[400px] bg-gray-100">
              {ticket.image ? (
                <Image
                  src={ticket.image}
                  alt={ticket.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}

              {/* Transport Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow">
                  {ticket.transportType}
                </span>
              </div>
            </div>

            {/* Right: Details + Booking */}
            <div className="p-6 lg:p-8 flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {ticket.title}
              </h1>

              {/* From → To */}
              <div className="flex items-center gap-3 mb-5 text-lg">
                <span className="font-semibold text-gray-800">
                  {ticket.fromLocation}
                </span>
                <span className="text-gray-400 text-xl">→</span>
                <span className="font-semibold text-gray-800">
                  {ticket.toLocation}
                </span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="text-3xl font-bold text-blue-600">
                  ৳{ticket.price}
                </span>
                <span className="text-gray-500 ml-1">per seat</span>
              </div>

              {/* Availability Badge */}
              <div className="mb-5">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                    ticket.quantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {ticket.quantity > 0
                    ? `${ticket.quantity} seats available`
                    : "Sold Out"}
                </span>
              </div>

              {/* Departure Date & Time */}
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                <span className="font-medium">
                  {new Date(ticket.departureDateTime).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Perks */}
              {ticket.perks && ticket.perks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Perks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.perks.map((perk, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Info (optional) */}
              {ticket.vendorName && (
                <div className="text-sm text-gray-500 mb-6">
                  Sold by:{" "}
                  <span className="font-medium text-gray-700">
                    {ticket.vendorName}
                  </span>
                </div>
              )}

              {/* Interactive Booking Section (Client Component) */}
              <TicketBookingSection ticket={ticket} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
