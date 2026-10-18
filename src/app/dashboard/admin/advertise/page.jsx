
import AdvertiseTicketTable from "@/components/AdvertiseTicketTable";
import { getAdvertisedTickets, getAllTicket } from "@/lib/api/product";


const Page = async () => {
  const [Tickets, advertisedTickets] = await Promise.all([
    getAllTicket(),
    getAdvertisedTickets(),
  ]);

  // শুধু approved ticket দেখাবে
  const approvedTickets = Tickets.filter(
    (ticket) => ticket.status === "approved",
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Advertisement
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Select up to 6 approved tickets for the homepage.
          </p>
        </div>

        <AdvertiseTicketTable
          approvedTickets={approvedTickets}
          advertisedTickets={advertisedTickets}
        />
      </div>
    </div>
  );
};

export default Page;
