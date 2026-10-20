"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/action/booking";
import toast from "react-hot-toast";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await getMyBookings();
    console.log("FOr check this page ",res);

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
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

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
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pay Now বাটনে ক্লিক (এখন শুধু placeholder)
  const handlePayNow = (booking) => {
    // পরে এখানে Stripe কোড বসাবা
    toast.success(`Payment coming soon! Amount: ৳${booking.totalPrice}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Booked Tickets</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          You have not booked any tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const timePassed = isTimePassed(booking.departureDateTime);
            const showPayButton = booking.status === "accepted" && !timePassed;
            const showCountdown = booking.status !== "rejected";

            return (
              <div
                key={booking._id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      booking.ticketImage ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={booking.ticketTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold line-clamp-1">
                    {booking.ticketTitle}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {booking.fromLocation} → {booking.toLocation}
                  </p>

                  <p className="text-sm text-gray-600">
                    Departure:{" "}
                    {booking.departureDateTime
                      ? new Date(booking.departureDateTime).toLocaleString()
                      : "N/A"}
                  </p>

                  <div className="flex justify-between text-sm">
                    <span>Quantity: {booking.quantity}</span>
                    <span className="font-semibold">৳{booking.totalPrice}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>

                    {/* Countdown */}
                    {showCountdown && (
                      <span className="text-xs text-gray-500">
                        {getCountdown(booking.departureDateTime)}
                      </span>
                    )}
                  </div>

                  {/* Stribe Pay Now Button */}
                  {showPayButton && (
                    <form action={`api/payment`} method="POST">
                      <input value={booking.price} name="price" />
                      <input value={booking.title} name="title" />
                      <input value={booking.id} name="productId" />

                      <button
                        type="submit"
                        onClick={() => handlePayNow(booking)}
                        className="cursor-pointer w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Pay Now (৳{booking.totalPrice})
                      </button>
                    </form>
                  )}

                  {/* Time Expired Message */}
                  {booking.status === "accepted" && timePassed && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      Payment time expired
                    </p>
                  )}
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
