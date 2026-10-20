import Image from "next/image";
import Link from "next/link";

const TicketCard = ({ ticket }) => {
  // Format departure date & time nicely
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Ticket Image */}
        <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
          {ticket.image ? (
            <Image
              src={ticket.image}
              alt={ticket.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-zinc-200 dark:bg-zinc-800">
              <span className="text-zinc-400 dark:text-zinc-500">
                No image available
              </span>
            </div>
          )}

          {/* Transport Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {ticket.transportType}
            </span>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-1">
            {ticket.title}
          </h3>

          {/* From → To */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {ticket.fromLocation}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">→</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {ticket.toLocation}
            </span>
          </div>

          {/* Departure Date & Time */}
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            <svg
              className="w-4 h-4 text-zinc-400 dark:text-zinc-500"
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
            <span>{formatDateTime(ticket.departureDateTime)}</span>
          </div>

          {/* Perks */}
          {ticket.perks && ticket.perks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ticket.perks.map((perk, index) => (
                <span
                  key={index}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700"
                >
                  {perk}
                </span>
              ))}
            </div>
          )}

          {/* Price + Quantity */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ৳{ticket.price}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                / seat
              </span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {ticket.quantity} seats left
            </div>
          </div>
        </div>
      </div>

      {/* See Details Button */}
      <div className="px-5 pb-5">
        <Link href={`/tickets/${ticket._id}`}>
          <button className="cursor-pointer w-full bg-black dark:bg-white text-white dark:text-black py-2.5 px-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-sm">
            See Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
