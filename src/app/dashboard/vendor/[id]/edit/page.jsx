"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteVendorTicket, getVendorTicketById, updateVendorTicket } from "@/lib/action/myaction";


const EditTicketPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTicket = async () => {
      setLoading(true);
      const data = await getVendorTicketById(id);

      if (!active) return;

      setTicket(data);
      if (!data) {
        setError("Ticket not found, or you do not have permission to edit it.");
      }

      setLoading(false);
    };

    if (id) loadTicket();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTicket((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!ticket || ticket.status === "rejected" || saving) return;

    setSaving(true);
    setError("");

    const formData = {
      title: ticket.title.trim(),
      fromLocation: ticket.fromLocation.trim(),
      toLocation: ticket.toLocation.trim(),
      transportType: ticket.transportType,
      price: Number(ticket.price),
      quantity: Number(ticket.quantity),
      image: ticket.image || "",
    };

    const result = await updateVendorTicket(id, formData);

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    alert(result.message);
    router.push("/dashboard/vendor/my-tickets");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!ticket || ticket.status === "rejected" || saving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${ticket.title}"?`,
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    const result = await deleteVendorTicket(id);

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    alert(result.message);
    router.push("/dashboard/vendor/my-tickets");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">Loading ticket...</div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          {error || "Ticket not found."}
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const rejected = ticket.status === "rejected";

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100";

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Edit Ticket</h1>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            ticket.status === "approved"
              ? "bg-green-100 text-green-700"
              : rejected
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {ticket.status || "pending"}
        </span>
      </div>

      {rejected && (
        <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          This ticket was rejected. Update and Delete are disabled.
        </p>
      )}

      {error && (
        <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label htmlFor="title" className="font-medium text-gray-700">
            Ticket Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={ticket.title || ""}
            onChange={handleChange}
            disabled={rejected || saving}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="fromLocation" className="font-medium text-gray-700">
            From Location
          </label>
          <input
            id="fromLocation"
            name="fromLocation"
            type="text"
            required
            value={ticket.fromLocation || ""}
            onChange={handleChange}
            disabled={rejected || saving}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="toLocation" className="font-medium text-gray-700">
            To Location
          </label>
          <input
            id="toLocation"
            name="toLocation"
            type="text"
            required
            value={ticket.toLocation || ""}
            onChange={handleChange}
            disabled={rejected || saving}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="transportType" className="font-medium text-gray-700">
            Transport Type
          </label>
          <select
            id="transportType"
            name="transportType"
            required
            value={ticket.transportType || ""}
            onChange={handleChange}
            disabled={rejected || saving}
            className={inputClass}
          >
            <option value="">Select transport</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Flight</option>
            <option value="Launch">Launch</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="font-medium text-gray-700">
              Price (৳)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={ticket.price ?? ""}
              onChange={handleChange}
              disabled={rejected || saving}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="font-medium text-gray-700">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              required
              value={ticket.quantity ?? ""}
              onChange={handleChange}
              disabled={rejected || saving}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="font-medium text-gray-700">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={ticket.image || ""}
            onChange={handleChange}
            disabled={rejected || saving}
            className={inputClass}
            placeholder="https://example.com/image.jpg"
          />

          {ticket.image && (
            <img
              src={ticket.image}
              alt={ticket.title || "Ticket"}
              className="mt-3 h-48 w-full rounded-lg object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={rejected || saving}
            className={`cursor-pointer rounded-lg px-4 py-3 font-semibold transition ${
              rejected || saving
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {saving ? "Please wait..." : "Update Ticket"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={rejected || saving}
            className={`cursor-pointer rounded-lg px-4 py-3 font-semibold transition ${
              rejected || saving
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {saving ? "Please wait..." : "Delete Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicketPage;
