
import AdvertiseTicketTable from "@/components/AdvertiseTicketTable";
import { getAllTicketsForAdmin } from "@/lib/action/adminTicket";
import { getAdvertisedTickets } from "@/lib/api/product";

const Page = async () => {
  let tickets = [];
  let advertisedTickets = [];

  try {
    const [allTickets, advertised] = await Promise.all([
      getAllTicketsForAdmin(),
      getAdvertisedTickets(),
    ]);

    tickets = Array.isArray(allTickets) ? allTickets : [];
    advertisedTickets = Array.isArray(advertised) ? advertised : [];
  } catch (error) {
    console.error("Failed to load advertisement tickets:", error);
  }

  // Only approved tickets can be advertised.
  const approvedTickets = tickets.filter(
    (ticket) => ticket.status === "approved"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 transition-colors duration-300 dark:bg-gray-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Advertisement
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select up to 6 approved tickets for the homepage.
          </p>
        </div>

        {/* Advertisement tickets table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
          <AdvertiseTicketTable
            approvedTickets={approvedTickets}
            advertisedTickets={advertisedTickets}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

