"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/action/booking";
import toast from "react-hot-toast";
import { CreditCard, CheckCircle2 } from "lucide-react";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await getMyBookings();
    console.log("For check this page ", res);

    if (res.success) {
      setBookings(res.data);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Countdown হিসাব
  const getCountdown = (departureDateTime) => {
    if (!departureDateTime) return "No date";

    const now = new Date().getTime();
    const departure = new Date(departureDateTime).getTime();
    const difference = departure - now;

    if (difference <= 0) {
      return "Time Expired";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  // Departure time পার হয়েছে কিনা
  const isTimePassed = (departureDateTime) => {
    if (!departureDateTime) return true;
    return new Date(departureDateTime).getTime() < new Date().getTime();
  };

  // Status অনুযায়ী রঙ
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  // Pay Now বাটনে ক্লিক
  const handlePayNow = (booking) => {
    toast.loading("Redirecting to Stripe checkout...", { id: "stripe-redirect" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-default-500">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-default-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Booked Tickets
          </h1>
          <p className="text-sm text-default-500 mt-1">
            Track status, departure times, and complete payment for accepted bookings.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-default-400 bg-default-50/50 rounded-2xl border border-dashed border-default-200">
          You have not booked any tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const isPaid = booking.status?.toLowerCase() === "paid";
            const timePassed = isTimePassed(booking.departureDateTime);
            const showPayButton =
              booking.status?.toLowerCase() === "accepted" &&
              !timePassed &&
              !isPaid;
            const showCountdown =
              booking.status?.toLowerCase() !== "rejected" && !isPaid;

            return (
              <div
                key={booking._id}
                className="border border-default-200 bg-background rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden bg-default-100 relative">
                  <img
                    src={
                      booking.ticketImage ||
                      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80"
                    }
                    alt={booking.ticketTitle || "Ticket"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs capitalize ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-foreground line-clamp-1">
                      {booking.ticketTitle}
                    </h2>

                    <p className="text-xs font-medium text-default-500">
                      {booking.fromLocation} → {booking.toLocation}
                    </p>

                    <p className="text-xs text-default-400">
                      Departure:{" "}
                      {booking.departureDateTime
                        ? new Date(booking.departureDateTime).toLocaleString()
                        : "N/A"}
                    </p>

                    <div className="flex justify-between items-center text-sm pt-2 border-t border-default-200/60">
                      <span className="text-xs text-default-500">
                        Qty: <strong>{booking.quantity}</strong>
                      </span>
                      <span className="font-extrabold text-primary text-base">
                        ৳{booking.totalPrice}
                      </span>
                    </div>

                    {/* Countdown */}
                    {showCountdown && (
                      <div className="flex items-center justify-between text-xs text-default-400 pt-1">
                        <span>Time remaining:</span>
                        <span className="font-medium text-default-700">
                          {getCountdown(booking.departureDateTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment / Status Section */}
                  <div>
                    {/* Stripe Pay Now Button */}
                    {showPayButton && (
                      <form action="/api/payment" method="POST" className="mt-2">
                        <input
                          type="hidden"
                          name="price"
                          value={booking.totalPrice || booking.price || 0}
                        />
                        <input
                          type="hidden"
                          name="title"
                          value={
                            booking.ticketTitle ||
                            booking.title ||
                            "Ticket Booking"
                          }
                        />
                        <input
                          type="hidden"
                          name="productId"
                          value={
                            booking.ticketId ||
                            booking.productId ||
                            booking._id
                          }
                        />
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking._id}
                        />

                        <button
                          type="submit"
                          onClick={() => handlePayNow(booking)}
                          className="cursor-pointer w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Now (৳{booking.totalPrice})</span>
                        </button>
                      </form>
                    )}

                    {/* Paid status badge */}
                    {isPaid && (
                      <div className="mt-2 text-center py-2.5 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Payment Completed (Paid)</span>
                      </div>
                    )}

                    {/* Time Expired Message */}
                    {booking.status?.toLowerCase() === "accepted" && timePassed && !isPaid && (
                      <p className="text-xs text-red-500 text-center mt-2 font-medium">
                        Payment window has expired
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
