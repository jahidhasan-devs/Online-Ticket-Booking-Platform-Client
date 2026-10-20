import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPaymentHistory } from "@/lib/action/payment";
import Link from "next/link";
import {
  Receipt,
  CreditCard,
  Calendar,
  Ticket,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Transaction History | Buyer Dashboard",
  description: "View all completed Stripe transactions, payment dates, and receipts.",
};

export default async function TransactionHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let transactions = [];
  let errorMsg = null;

  if (user) {
    try {
      // Fetch user's payments from the backend / database
      const result = await getPaymentHistory();

      if (result.success && Array.isArray(result.data)) {
        transactions = result.data
          .filter((item) => {
            // Match transaction to current logged-in user
            const matchesUser =
              item.userId === user.id ||
              item.userEmail?.toLowerCase() === user.email?.toLowerCase() ||
              item.customer_email?.toLowerCase() === user.email?.toLowerCase() ||
              item.email?.toLowerCase() === user.email?.toLowerCase();

            return matchesUser;
          })
          .map((item, index) => {
            const transactionId =
              item.transactionId ||
              item.session_id ||
              item.paymentIntentId ||
              item._id;

            const amountValue =
              item.amount ||
              item.price ||
              (item.amount_total ? (item.amount_total / 100).toFixed(2) : "0");

            const ticketTitle =
              item.ticketTitle ||
              item.title ||
              "Ticket Booking";

            const rawDate =
              item.paymentDate ||
              item.paidAt ||
              item.createdAt;

            const formattedDate = rawDate
              ? new Date(rawDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";

            return {
              id: item._id || String(index),
              index: index + 1,
              transactionId,
              amount: `$${amountValue}`,
              rawAmount: Number(amountValue) || 0,
              ticketTitle,
              paymentDate: formattedDate,
              currency: (item.currency || "USD").toUpperCase(),
              status: item.status || "paid",
            };
          });
      }
    } catch (err) {
      console.error("Error retrieving backend payments:", err);
      errorMsg = "Unable to load transactions from backend at the moment.";
    }
  }

  const totalSpent = transactions.reduce((acc, t) => acc + t.rawAmount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-default-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-primary" />
            <span>Transaction History</span>
          </h1>
          <p className="text-sm text-default-500 mt-1">
            All your verified Stripe ticket purchases loaded from the backend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/buyer/booked-tickets"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-default-100 hover:bg-default-200 text-foreground border border-default-200 transition"
          >
            <Ticket className="w-4 h-4 text-primary" />
            <span>My Booked Tickets</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-background border border-default-200 shadow-xs">
          <span className="text-xs font-semibold text-default-500 block mb-1">
            Total Transactions
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {transactions.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-background border border-default-200 shadow-xs">
          <span className="text-xs font-semibold text-default-500 block mb-1">
            Total Amount Spent
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            ${totalSpent.toFixed(2)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-background border border-default-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-default-500 block mb-1">
              Payment Gateway
            </span>
            <span className="text-base font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Backend Verified
            </span>
          </div>
          <CreditCard className="w-8 h-8 text-indigo-500/80" />
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Transactions Table */}
      {!user ? (
        <div className="text-center py-16 bg-default-50/50 rounded-2xl border border-dashed border-default-200">
          <p className="text-default-500 text-sm">
            Please log in to view your transaction history.
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-default-50/50 rounded-2xl border border-dashed border-default-200 space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No Transactions Found
          </h3>
          <p className="text-xs text-default-500 max-w-sm mx-auto">
            You haven&apos;t made any ticket payments yet. Once you complete a booking payment, it will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/buyer/booked-tickets"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Booked Tickets to Pay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="border border-default-200 rounded-2xl overflow-hidden bg-background shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-default-100/70 border-b border-default-200 text-xs uppercase tracking-wider text-default-500">
                  <th className="py-3.5 px-4 font-bold w-12">#</th>
                  <th className="py-3.5 px-4 font-bold">Transaction ID</th>
                  <th className="py-3.5 px-4 font-bold">Ticket Title</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Payment Date</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200/70">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-default-50/70 transition-colors"
                  >
                    {/* Index */}
                    <td className="py-4 px-4 text-xs font-medium text-default-400">
                      {tx.index}
                    </td>

                    {/* Transaction ID */}
                    <td className="py-4 px-4 font-mono text-xs text-default-700 font-semibold select-all">
                      <span className="px-2.5 py-1 rounded-md bg-default-100 border border-default-200/60 inline-block truncate max-w-[220px]">
                        {tx.transactionId}
                      </span>
                    </td>

                    {/* Ticket Title */}
                    <td className="py-4 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{tx.ticketTitle}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-extrabold text-emerald-600">
                      {tx.amount}{" "}
                      <span className="text-[10px] font-bold text-default-400">
                        {tx.currency}
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="py-4 px-4 text-xs text-default-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-default-400 shrink-0" />
                        <span>{tx.paymentDate}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Paid</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
