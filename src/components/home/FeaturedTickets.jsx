import Link from "next/link";

const AdvertisementSection = ({ tickets = [] }) => {
  if (tickets.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 bg-black text-white">
      <h2 className="mb-6 text-2xl font-bold tracking-tight border-b border-neutral-800 pb-3">
        Featured Tickets
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.slice(0, 6).map((ticket) => (
          <div
            key={String(ticket.ticketId || ticket._id)}
            className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-sm transition-all duration-300 hover:border-neutral-600"
          >
            {ticket.image && (
              <div className="relative overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title || "Ticket"}
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <div className="space-y-3 p-5">
              <h3 className="text-lg font-bold text-white tracking-wide">
                {ticket.title}
              </h3>

              <div className="space-y-1.5 text-sm text-neutral-400">
                <p className="flex justify-between">
                  <span className="text-neutral-500">Price:</span>
                  <span className="font-semibold text-white">
                    ৳{ticket.price ?? "N/A"}
                  </span>
                </p>

                <p className="flex justify-between">
                  <span className="text-neutral-500">Quantity:</span>
                  <span className="text-neutral-200">
                    {ticket.quantity ?? "N/A"}
                  </span>
                </p>

                <p className="flex justify-between">
                  <span className="text-neutral-500">Transport:</span>
                  <span className="text-neutral-200">
                    {ticket.transportType || "N/A"}
                  </span>
                </p>

                <p className="pt-1 border-t border-neutral-900">
                  <span className="text-neutral-500 block mb-1">Perks:</span>
                  <span className="text-xs text-neutral-300">
                    {Array.isArray(ticket.perks)
                      ? ticket.perks.join(", ")
                      : ticket.perks || "N/A"}
                  </span>
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/tickets/${ticket.ticketId || ticket._id}`}
                  className="block w-full text-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
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
