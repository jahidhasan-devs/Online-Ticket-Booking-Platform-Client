import { payment } from "@/lib/action/payment";
import { markBookingAsPaid } from "@/lib/action/booking";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Receipt,
  Ticket,
  Calendar,
  CreditCard,
  ArrowRight,
  House,
} from "lucide-react";

export const metadata = {
  title: "Payment Successful | TechBazaar",
  description: "Your ticket booking payment has been successfully completed.",
};

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, metadata } = session;
  const customerEmail =
    session.customer_details?.email || metadata?.userEmail || "your email";

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const bookingId = metadata?.bookingId;
    const transactionId =
      typeof session.payment_intent === "object"
        ? session.payment_intent?.id
        : session.payment_intent || session_id;

    const amount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : metadata?.amount || metadata?.price || "0";

    const ticketTitle =
      metadata?.ticketTitle || metadata?.title || "Ticket Booking";

    const paymentDate = metadata?.paymentDate
      ? new Date(metadata.paymentDate).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(session.created * 1000).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

    // 1. Update Booking status to "paid" so the card displays paid
    if (bookingId) {
      try {
        await markBookingAsPaid(bookingId, transactionId);
      } catch (err) {
        console.error("Error marking booking as paid:", err);
      }
    }

    // 2. Record payment in database / backend
    try {
      const pay_data = await payment({
        ...metadata,
        session_id,
        transactionId,
        status: "paid",
        bookingId,
      });
      console.log("Payment record result:", pay_data);
    } catch (err) {
      console.error("Backend payment recording failed:", err);
    }

    return (
      <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-background border border-default-200 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 p-8 text-center text-white relative">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner ring-4 ring-white/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Your ticket booking status is now <span className="font-bold underline">Paid</span>.
            </p>
          </div>

          {/* Transaction Summary Card */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-4 rounded-2xl bg-default-50 border border-default-200/80 space-y-3.5">
              {/* Ticket Title */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-default-200/60">
                <span className="text-xs font-semibold text-default-500 flex items-center gap-1.5 shrink-0">
                  <Ticket className="w-4 h-4 text-primary" />
                  Ticket
                </span>
                <span className="text-sm font-bold text-foreground text-right line-clamp-2">
                  {ticketTitle}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pb-3 border-b border-default-200/60">
                <span className="text-xs font-semibold text-default-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Booking Status
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Paid
                </span>
              </div>

              {/* Amount Paid */}
              <div className="flex items-center justify-between pb-3 border-b border-default-200/60">
                <span className="text-xs font-semibold text-default-500 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Amount Paid
                </span>
                <span className="text-lg font-extrabold text-emerald-600">
                  ${amount} USD
                </span>
              </div>

              {/* Transaction ID */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-default-200/60">
                <span className="text-xs font-semibold text-default-500 flex items-center gap-1.5 shrink-0">
                  <Receipt className="w-4 h-4 text-indigo-500" />
                  Transaction ID
                </span>
                <span className="font-mono text-xs font-semibold text-default-700 break-all text-right max-w-[200px]">
                  {transactionId}
                </span>
              </div>

              {/* Payment Date */}
              <div className="flex items-center justify-between pb-3 border-b border-default-200/60">
                <span className="text-xs font-semibold text-default-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Payment Date
                </span>
                <span className="text-xs font-medium text-foreground">
                  {paymentDate}
                </span>
              </div>

              {/* Customer Email */}
              <div className="pt-1 text-center">
                <p className="text-xs text-default-500">
                  A receipt and booking confirmation has been registered for{" "}
                  <strong className="text-foreground">{customerEmail}</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/buyer/booked-tickets"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-95 transition"
              >
                <span>View Booked Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/buyer/transaction"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-default-100 hover:bg-default-200 text-foreground font-semibold text-sm border border-default-200 transition"
              >
                <span>Transaction History</span>
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-default-500 hover:text-primary transition font-medium"
              >
                <House className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="p-8 text-center text-default-600">
      Processing payment status...
    </div>
  );
}
