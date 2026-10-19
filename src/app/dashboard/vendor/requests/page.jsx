"use client";

import { useEffect, useState } from "react";
import {
  getRequestedBookings,
  acceptBooking,
  rejectBooking,
} from "@/lib/action/booking";
import toast from "react-hot-toast";

const RequestedBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await getRequestedBookings();

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

  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId + "-accept");
    const res = await acceptBooking(bookingId);

    if (res.success) {
      toast.success(res.message);
      // টেবিল থেকে সরিয়ে দাও
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } else {
      toast.error(res.message);
    }
    setActionLoading(null);
  };

  const handleReject = async (bookingId) => {
    setActionLoading(bookingId + "-reject");
    const res = await rejectBooking(bookingId);

    if (res.success) {
      toast.success(res.message);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } else {
      toast.error(res.message);
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading requested bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Requested Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No pending booking requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Ticket Title</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Total Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{booking.userName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{booking.ticketTitle}</td>
                  <td className="px-4 py-3">{booking.quantity}</td>
                  <td className="px-4 py-3 font-semibold">
                    ৳{booking.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(booking._id)}
                        disabled={actionLoading === booking._id + "-accept"}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === booking._id + "-accept"
                          ? "Accepting..."
                          : "Accept"}
                      </button>

                      <button
                        onClick={() => handleReject(booking._id)}
                        disabled={actionLoading === booking._id + "-reject"}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading === booking._id + "-reject"
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedBookingsPage;
