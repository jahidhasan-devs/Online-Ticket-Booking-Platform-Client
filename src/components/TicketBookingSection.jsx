// components/TicketBookingSection.tsx  (or .jsx)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TicketBookingSection({ ticket }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingQty, setBookingQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const departure = new Date(ticket.departureDateTime).getTime();
      const difference = departure - now;

      if (difference <= 0) {
        setTimeLeft("Departure time has passed");
        setIsExpired(true);
        return;
      }

      setIsExpired(false);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ticket.departureDateTime]);

  // Disable conditions
  const isSoldOut = ticket.quantity <= 0;
  const isBookDisabled = isExpired || isSoldOut;

  // Open Modal
  const handleBookNow = () => {
    if (isBookDisabled) return;
    setBookingQty(1);
    setError("");
    setIsModalOpen(true);
  };

  // Handle quantity change
  const handleQtyChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBookingQty(value);
    setError("");
  };

  // Submit Booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (bookingQty < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (bookingQty > ticket.quantity) {
      setError(`You can book maximum ${ticket.quantity} seats`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket._id,
          quantity: bookingQty,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }

      setIsModalOpen(false);
      router.push("/my-bookings");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto space-y-5">
      {/* Countdown */}
      <div
        className={`rounded-xl p-4 text-center ${
          isExpired
            ? "bg-red-50 border border-red-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <p className="text-sm font-medium text-gray-600 mb-1">
          {isExpired ? "Status" : "Time Remaining until Departure"}
        </p>
        <p
          className={`text-xl font-bold tracking-wide ${
            isExpired ? "text-red-600" : "text-blue-700"
          }`}
        >
          {timeLeft}
        </p>
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        disabled={isBookDisabled}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
          isBookDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {isSoldOut ? "Sold Out" : isExpired ? "Departure Passed" : "Book Now"}
      </button>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Book Tickets</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ticket</p>
                <p className="font-semibold text-gray-900">{ticket.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Price per seat</p>
                <p className="font-semibold text-blue-600">৳{ticket.price}</p>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Number of Seats
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={ticket.quantity}
                  value={bookingQty}
                  onChange={handleQtyChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Available: {ticket.quantity} seats
                </p>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ৳{ticket.price * bookingQty}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
