import TicketTable from "@/components/TicketTable";
import { getAllTicketsForAdmin } from "@/lib/action/adminTicket";



const Page = async () => {
  const tickets = await getAllTicketsForAdmin();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">
        Admin Ticket Management
      </h1>

      <TicketTable tickets={tickets} />
    </div>
  );
};

export default Page;
