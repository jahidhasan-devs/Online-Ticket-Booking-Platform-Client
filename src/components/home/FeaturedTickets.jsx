import Link from "next/link";

const AdvertisementSection = ({ tickets = [] }) => {
  if (tickets.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">Featured Tickets</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.slice(0, 6).map((ticket) => (
          <div
            key={String(ticket.ticketId || ticket._id)}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            {ticket.image && (
              <img
                src={ticket.image}
                alt={ticket.title || "Ticket"}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="space-y-2 p-4">
              <h3 className="text-lg font-bold">{ticket.title}</h3>

              <p>Price: ৳{ticket.price ?? "N/A"}</p>

              <p>Quantity: {ticket.quantity ?? "N/A"}</p>

              <p>Transport: {ticket.transportType || "N/A"}</p>

              <p>
                Perks:{" "}
                {Array.isArray(ticket.perks)
                  ? ticket.perks.join(", ")
                  : ticket.perks || "N/A"}
              </p>

              <Link
                href={`/tickets/${ticket.ticketId || ticket._id}`}
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                See details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvertisementSection;
