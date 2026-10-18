import MyTicketsGrid from "@/components/MyTicketGrid";
import { getMyTickets } from "@/lib/action/myaction";

const Page = async () => {
  const tickets = await getMyTickets();

  return (
    <div className="min-h-screen bg-white p-4 transition-colors dark:bg-black md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-gray-200 pb-5 dark:border-neutral-800">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            My Tickets
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            Manage all tickets added by you.
          </p>
        </div>

        <MyTicketsGrid tickets={Array.isArray(tickets) ? tickets : []} />
      </div>
    </div>
  );
};

export default Page;