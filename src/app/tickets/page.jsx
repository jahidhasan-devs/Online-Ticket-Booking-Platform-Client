

import TicketCard from "@/components/TicketCard";
import TicketFilter from "@/components/TicketFilter";
import PaginationControls from "@/components/PaginationControls";
import { getAllTicket } from "@/lib/api/product";

const TicketPage = async ({ searchParams }) => {
  const params = await searchParams;

  const search = params?.search || "";
  const from = params?.from || "";
  const to = params?.to || "";
  const transportType = params?.transportType || "";
  const sort = params?.sort || "";
  const page = parseInt(params?.page) || 1;

  // শুধুমাত্র এই পেজের জন্যই status: "approved" পাঠাচ্ছি
  const data = await getAllTicket({
    search,
    from,
    to,
    transportType,
    sort,
    status: "approved", // <--- অন্য পেজ প্রভাবিত হবে না
    page,
    limit: 8,
  });

  // ব্যাকএন্ড যদি অ্যারে পাঠায় (অন্য পুরানো পেজের জন্য) বা অবজেক্ট পাঠায় তা হ্যান্ডেল করার সেফ লজিক
  const tickets = Array.isArray(data) ? data : data?.tickets || [];
  const totalTickets = data?.totalTickets || tickets.length;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center transition-colors">
        All Approved Tickets
      </h1>

      {/* Filter and Search */}
      <TicketFilter />

      {/* Result Count */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Showing <b>{tickets.length}</b> of <b>{totalTickets}</b> tickets
        </p>
      </div>

      {/* Tickets List */}
      {tickets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls totalPages={totalPages} currentPage={page} />
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No approved tickets found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketPage;
































// import TicketCard from "@/components/TicketCard";
// import SearchTicket from "@/components/SearchTicket";
// import { getAllTicket } from "@/lib/api/product";

// const TicketPage = async ({ searchParams }) => {
//   const { search } = await searchParams;
//   const Tickets = await getAllTicket(search);

//   // Only approved tickets
//   const approvedTickets = Tickets.filter(
//     (ticket) => ticket.status === "approved",
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//         Our Ticket
//       </h1>

//       <div className="text-center mb-10">
//         <SearchTicket />
//       </div>

//       {search && (
//         <h2>
//           Found {approvedTickets.length} Products with the search term{" "}
//           <b>{search}</b>
//         </h2>
//       )}

//       {approvedTickets.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {approvedTickets.map((ticket) => (
//             <TicketCard key={ticket._id} ticket={ticket} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No approved tickets found.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketPage;
