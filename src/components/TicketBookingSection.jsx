
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/action/booking";

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
    if (!ticket.departureDateTime) {
      setTimeLeft("Departure time unavailable");
      setIsExpired(true);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const departure = new Date(ticket.departureDateTime).getTime();
      const difference = departure - now;

      if (Number.isNaN(departure) || difference <= 0) {
        setTimeLeft(
          Number.isNaN(departure)
            ? "Departure time unavailable"
            : "Departure time has passed"
        );
        setIsExpired(true);
        return;
      }

      setIsExpired(false);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
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

  // Booking Conditions
  const isSoldOut = Number(ticket.quantity) <= 0;
  const isBookDisabled = isExpired || isSoldOut;

  // Open Booking Modal
  const handleBookNow = () => {
    if (isBookDisabled) return;

    setBookingQty(1);
    setError("");
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setError("");
  };

  // Quantity Change
  const handleQtyChange = (e) => {
    const value = e.target.value;

    setBookingQty(value === "" ? "" : Number(value));
    setError("");
  };

  // Submit Booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError("");

    const quantity = Number(bookingQty);
    const availableSeats = Number(ticket.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    if (quantity > availableSeats) {
      setError(`You can book a maximum of ${availableSeats} seats`);
      return;
    }

    if (isExpired) {
      setError("Departure time has passed. You cannot book this ticket.");
      return;
    }

    if (isSoldOut) {
      setError("Sorry, this ticket is sold out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        ticketId: ticket._id,
        quantity,
        status: "Pending",
      });

      if (!result?.success) {
        throw new Error(result?.message || "Booking failed");
      }

      setIsModalOpen(false);

      alert("Successfully booked! Please wait for confirmation.");

      router.push("/my-bookings");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto space-y-5">

      {/* Countdown */}
      <div
        className={`rounded-xl border p-5 text-center transition-colors duration-300 ${
          isExpired
            ? "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900"
            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-black"
        }`}
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {isExpired ? "Departure Status" : "Time Until Departure"}
          </p>
        </div>

        <p className="break-words text-xl font-bold tracking-wide text-black dark:text-white sm:text-2xl">
          {timeLeft || "Calculating..."}
        </p>
      </div>

      {/* Book Now Button */}
      <button
        type="button"
        onClick={handleBookNow}
        disabled={isBookDisabled}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 ${
          isBookDisabled
            ? "cursor-not-allowed border border-gray-300 bg-gray-200 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
            : "bg-black text-white hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
        }`}
      >
        {isSoldOut ? (
          "Sold Out"
        ) : isExpired ? (
          "Departure Passed"
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>

            Book Now
          </>
        )}
      </button>

      {/* Booking Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-gray-700 dark:bg-black dark:text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div>
                <h3
                  id="booking-modal-title"
                  className="text-xl font-bold"
                >
                  Book Tickets
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Complete your ticket booking
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                aria-label="Close booking modal"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmitBooking}
              className="space-y-5 p-6"
            >
              {/* Ticket Name */}
              <div>
                <p className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  Ticket
                </p>

                <p className="font-semibold text-gray-900 dark:text-white">
                  {ticket.title}
                </p>
              </div>

              {/* Price */}
              <div>
                <p className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  Price Per Seat
                </p>

                <p className="text-xl font-bold text-black dark:text-white">
                  ৳{ticket.price}
                </p>
              </div>

              {/* Quantity Input */}
              <div>
                <label
                  htmlFor="booking-quantity"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Number of Seats
                </label>

                <input
                  id="booking-quantity"
                  type="number"
                  min={1}
                  max={Number(ticket.quantity)}
                  step={1}
                  value={bookingQty}
                  onChange={handleQtyChange}
                  disabled={isSubmitting}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-gray-700"
                />

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Available seats: {ticket.quantity}
                </p>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-black dark:text-white">
                  ৳
                  {Number.isFinite(Number(bookingQty))
                    ? Number(ticket.price) * Number(bookingQty)
                    : 0}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isExpired || isSoldOut}
                  className="flex w-full cursor-pointer items-center
                   justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold
                    text-white transition hover:bg-gray-800 disabled:cursor-not-allowed
                     disabled:bg-gray-400 dark:bg-white dark:text-black
                      dark:hover:bg-gray-200 dark:disabled:bg-gray-700
                       dark:disabled:text-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>

                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
