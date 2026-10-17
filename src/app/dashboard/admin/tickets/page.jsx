import TicketTable from "@/components/TicketTable";
import { getAllTicket } from "@/lib/api/product";


const Page = async () => {
  const tickets = await getAllTicket();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Ticket Management</h1>

      <TicketTable tickets={tickets} />
    </div>
  );
};

export default Page;
