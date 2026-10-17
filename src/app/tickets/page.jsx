import TicketCard from "@/components/TicketCard";
import SearchTicket from "@/components/SearchTicket";
import { getAllTicket } from "@/lib/api/product";

const TicketPage = async ({ searchParams }) => {
  const { search } = await searchParams;
  const Tickets = await getAllTicket(search);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Our Ticket
      </h1>

      <div className="text-center mb-10">
        <SearchTicket />
      </div>

      {search && (
        <h2>
          Found {Tickets.length} Products with the search term <b>{search}</b>
        </h2>
      )}

      {Tickets && Tickets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default TicketPage;
