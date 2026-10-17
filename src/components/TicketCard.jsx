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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Ticket Image */}
      <div className="relative h-48 w-full bg-gray-100">
        {ticket.image ? (
          <Image
            src={ticket.image}
            alt={ticket.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Transport Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {ticket.transportType}
          </span>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
          {ticket.title}
        </h3>

        {/* From → To */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="font-medium text-gray-800">
            {ticket.fromLocation}
          </span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-gray-800">{ticket.toLocation}</span>
        </div>

        {/* Departure Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <svg
            className="w-4 h-4 text-gray-400"
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
                className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {perk}
              </span>
            ))}
          </div>
        )}

        {/* Price + Quantity */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ৳{ticket.price}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ seat</span>
          </div>
          <div className="text-sm text-gray-500">
            {ticket.quantity} seats left
          </div>
        </div>

        {/* See Details Button */}
        <Link href={`/tickets/${ticket._id}`}>
          <button className="cursor-pointer w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            See Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
