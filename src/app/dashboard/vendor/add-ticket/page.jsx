"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Chip } from "@heroui/react";
import {
  Bus,
  Train,
  Plane,
  Ship,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  Loader2,
  X,
  Wind,
  Wifi,
  Coffee,
  Droplet,
  Zap,
  ArrowLeft,
  Store,
  Layers,
} from "lucide-react";

import { imageUpload } from "@/lib/imgUpload";
import { addTicket } from "@/lib/action/products";

// Supported transport categories with matching styles & fallback photos
const TRANSPORT_CONFIG = {
  Bus: {
    label: "AC / Non-AC Bus",
    icon: Bus,
    chipClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    fallbackImg:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  Train: {
    label: "Intercity Train",
    icon: Train,
    chipClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    fallbackImg:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
  },
  Flight: {
    label: "Domestic Flight",
    icon: Plane,
    chipClass:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    fallbackImg:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  Ship: {
    label: "Launch / Ship",
    icon: Ship,
    chipClass:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    fallbackImg:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  },
};

// Perks & Amenities available for vendors to toggle
const AMENITIES = [
  { id: "AC", label: "Air Conditioned", icon: Wind },
  { id: "Free Wi-Fi", label: "Free Wi-Fi", icon: Wifi },
  { id: "Meal / Snack", label: "Complimentary Snack", icon: Coffee },
  { id: "Water Bottle", label: "Mineral Water", icon: Droplet },
  { id: "Charging Port", label: "Mobile Charger", icon: Zap },
  { id: "Reclining Seat", label: "Reclining Seat", icon: Sparkles },
];

export default function AddTicketForm({ user }) {
  const router = useRouter();
  const fileInputId = useId();

  // Form inputs state for Real-Time Live Preview
  const [title, setTitle] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [transportType, setTransportType] = useState("Bus");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [departureDateTime, setDepartureDateTime] = useState("");
  const [selectedPerks, setSelectedPerks] = useState(["AC", "Water Bottle"]);

  // Local image file & preview
  const [imageFile, setImageFile] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState("");

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Toggle perks handler
  const handleTogglePerk = (perkLabel) => {
    if (selectedPerks.includes(perkLabel)) {
      setSelectedPerks(selectedPerks.filter((p) => p !== perkLabel));
    } else {
      setSelectedPerks([...selectedPerks, perkLabel]);
    }
  };

  // Image select handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setLocalImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setLocalImagePreview("");
  };

  // Submit Handler
 
const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);
  setStatusMessage(null);

  try {
    let finalImageUrl = TRANSPORT_CONFIG[transportType]?.fallbackImg;

    // Upload image if a file is selected
    if (imageFile) {
      try {
        const uploaded = await imageUpload(imageFile);

        if (uploaded?.url) {
          finalImageUrl = uploaded.url;
        }
      } catch (uploadErr) {
        console.warn("Image upload failed, using fallback image:", uploadErr);
      }
    }

    const ticketPayload = {
      title: title.trim(),
      fromLocation: fromLocation.trim(),
      toLocation: toLocation.trim(),
      transportType,
      price: Number(price),
      quantity: Number(quantity),
      departureDateTime,
      perks: selectedPerks,
      image: finalImageUrl,
      vendorName: user?.name || "Verified Vendor",
      vendorEmail: user?.email || "vendor@techbazaar.com",
      status: "pending",
    };

    const result = await addTicket(ticketPayload);

    // Backend error: ticket add হয়নি
    if (!result?.success) {
      setStatusMessage({
        type: "error",
        text:
          result?.status === 403
            ? `⚠️ Your vendor account has been restricted due to a policy violation.
               You cannot create new tickets. Please contact support if you believe this is a mistake.`
            : `❌ ${result?.message || "Failed to create ticket. Please try again."}`,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // Success message only when ticket is created
    setStatusMessage({
      type: "success",
      text: "🎉 Ticket created successfully! Your ticket has been submitted for verification.",
    });

    // Reset form only after success
    setTitle("");
    setFromLocation("");
    setToLocation("");
    setPrice("");
    setQuantity("");
    setDepartureDateTime("");
    setSelectedPerks(["AC", "Water Bottle"]);
    setImageFile(null);
    setLocalImagePreview("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (err) {
    // Unexpected frontend errors
    console.error("Unexpected ticket creation error:", err);

    setStatusMessage({
      type: "error",
      text: "❌ Something went wrong. Please try again.",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const activeConfig = TRANSPORT_CONFIG[transportType] || TRANSPORT_CONFIG.Bus;
  const SelectedTransportIcon = activeConfig.icon;
  const displayImage = localImagePreview || activeConfig.fallbackImg;

  // Format departure date for preview
  const formattedDeparture = departureDateTime
    ? new Date(departureDateTime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Select date & time";

  return (
    <div className="w-full space-y-6">
      {/* ================= TOP ACTION BAR & BREADCRUMB ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-default-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-default-500 mb-1">
            <Link
              href="/dashboard/vendor"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Vendor Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-foreground">Add Ticket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Ticket className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <span>Create & Publish Ticket Route</span>
          </h1>
          <p className="text-sm text-default-500 mt-0.5">
            Set up passenger route schedule, seating inventory, and transparent
            pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/vendor/tickets">
            <Button
              variant="outline"
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>View My Tickets</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= STATUS / ALERT BANNER ================= */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            )}
            <p className="text-sm font-semibold">{statusMessage.text}</p>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= MAIN 12-COLUMN DASHBOARD GRID ================= */}
      {/* Takes 100% of dashboard width: Left is Form (7-8 cols), Right is Live Preview (4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        {/* ================= LEFT COLUMN: FORM SECTION (lg:col-span-7 xl:col-span-8) ================= */}
        <div className="lg:col-span-7 xl:col-span-8 w-full">
          <Card className="p-6 sm:p-8 bg-background border border-default-200/80 shadow-xs rounded-2xl space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ---------- SECTION 1: TRANSPORT TYPE SELECTOR ---------- */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      1
                    </span>
                    <span>Select Transport Category</span>
                  </label>
                  <span className="text-xs text-default-400">Required</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(TRANSPORT_CONFIG).map(([key, config]) => {
                    const IconComponent = config.icon;
                    const isSelected = transportType === key;

                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setTransportType(key)}
                        className={`flex flex-col items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 transition-all text-center ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                            : "border-default-200 hover:border-primary/40 bg-default-50/50 hover:bg-default-100 text-default-700"
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-default-200/70 text-default-600"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---------- SECTION 2: BASIC ROUTE INFORMATION ---------- */}
              <div className="space-y-4 pt-6 border-t border-default-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      2
                    </span>
                    <span>Route & Trip Details</span>
                  </label>
                  <span className="text-xs text-default-400">
                    Origins & Destination
                  </span>
                </div>

                {/* Ticket Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-default-600">
                    Ticket Title / Route Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dhaka to Cox's Bazar Express AC Bus"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-default-200 text-foreground placeholder:text-default-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <p className="text-[11px] text-default-400">
                    Add a clear route title specifying transport grade (e.g.
                    Deluxe, Sleeper, Non-Stop)
                  </p>
                </div>

                {/* From and To Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-default-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>Departure Location (From) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      placeholder="e.g. Dhaka (Sayedabad)"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-default-200 text-foreground placeholder:text-default-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-default-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Destination Location (To) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      placeholder="e.g. Cox's Bazar (Kolatoli)"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-default-200 text-foreground placeholder:text-default-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>
              </div>

              {/* ---------- SECTION 3: PRICING, SCHEDULE & SEAT INVENTORY ---------- */}
              <div className="space-y-4 pt-6 border-t border-default-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      3
                    </span>
                    <span>Pricing, Schedule & Inventory</span>
                  </label>
                  <span className="text-xs text-default-400">Seat Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-default-600">
                      Fare / Price (BDT) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-bold text-default-400">
                        ৳
                      </span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 1450"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-background border border-default-200 text-foreground placeholder:text-default-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-default-600">
                      Total Seats Available *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 36"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-default-200 text-foreground placeholder:text-default-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>

                  {/* Departure DateTime */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-default-600">
                      Departure Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={departureDateTime}
                      onChange={(e) => setDepartureDateTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-default-200 text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>
              </div>

              {/* ---------- SECTION 4: PERKS & AMENITIES ---------- */}
              <div className="space-y-3 pt-6 border-t border-default-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      4
                    </span>
                    <span>Amenities & Included Perks</span>
                  </label>
                  <span className="text-xs text-default-400">Optional</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => {
                    const AmenityIcon = amenity.icon;
                    const isChecked = selectedPerks.includes(amenity.id);

                    return (
                      <button
                        type="button"
                        key={amenity.id}
                        onClick={() => handleTogglePerk(amenity.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                          isChecked
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-default-200 bg-default-50/50 hover:bg-default-100 text-default-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-default-300 bg-background"
                          }`}
                        >
                          {isChecked && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <AmenityIcon className="w-4 h-4 shrink-0 text-default-500" />
                        <span className="text-xs truncate">
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---------- SECTION 5: TICKET PHOTO / VEHICLE IMAGE ---------- */}
              <div className="space-y-3 pt-6 border-t border-default-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      5
                    </span>
                    <span>Vehicle / Route Photograph</span>
                  </label>
                  <span className="text-xs text-default-400">
                    PNG, JPG, WebP
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Upload Box */}
                  <label
                    htmlFor={fileInputId}
                    className="flex-1 w-full border-2 border-dashed border-default-300 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-default-50/40 hover:bg-primary/5 cursor-pointer transition text-center"
                  >
                    <UploadCloud className="w-8 h-8 text-primary animate-bounce" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Click to upload coach or vessel image
                      </p>
                      <p className="text-xs text-default-400 mt-0.5">
                        High quality photo attracts up to 40% more passenger
                        bookings
                      </p>
                    </div>
                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Thumbnail Preview */}
                  {localImagePreview && (
                    <div className="relative w-full sm:w-40 h-28 rounded-2xl overflow-hidden border border-default-200 shadow-sm shrink-0">
                      <img
                        src={localImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------- SECTION 6: VENDOR IDENTITY (READ-ONLY) ---------- */}
              <div className="p-4 rounded-xl bg-default-100/70 border border-default-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-default-600">
                    Publishing as:{" "}
                    <strong className="text-foreground">
                      {user?.name || "Vendor Partner"}
                    </strong>{" "}
                    ({user?.email || "vendor@techbazaar.com"})
                  </span>
                </div>
                <span className="text-default-400">
                  Verification status:{" "}
                  <strong className="text-amber-600 font-semibold">
                    Under Review
                  </strong>
                </span>
              </div>

              {/* ---------- SUBMIT BUTTON BAR ---------- */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-default-200/70">
                <Link href="/dashboard/vendor">
                  <Button
                    type="button"
                    variant="outline"
                    className="font-semibold text-xs px-5"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground font-bold px-8 shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Publish Ticket Route</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: LIVE CARD PREVIEW & GUIDELINES (lg:col-span-5 xl:col-span-4) ================= */}
        <div className="lg:col-span-5 xl:col-span-4 w-full space-y-6 lg:sticky lg:top-6">
          {/* Card 1: Real-time Live Ticket Preview */}
          <Card className="overflow-hidden border border-default-200/80 bg-background shadow-md">
            <div className="p-4 border-b border-default-200/80 bg-default-100/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Ticket Preview
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Passenger View
              </span>
            </div>

            {/* Simulated Marketplace Ticket Card */}
            <div className="p-4 space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden border border-default-200 bg-default-100">
                <img
                  src={displayImage}
                  alt={title || "Ticket Preview"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Transport Chip */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md shadow-xs ${activeConfig.chipClass}`}
                  >
                    <SelectedTransportIcon className="w-3.5 h-3.5" />
                    <span>{transportType}</span>
                  </span>
                </div>

                {/* Seat badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-black/75 text-white backdrop-blur-xs">
                    {quantity ? `${quantity} Seats Left` : "Available Seats"}
                  </span>
                </div>
              </div>

              {/* Title & Route */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
                  {title || "Dhaka to Cox's Bazar Express AC Bus"}
                </h3>

                <div className="flex items-center gap-2 text-xs font-semibold text-default-600">
                  <span className="truncate max-w-[110px] text-foreground">
                    {fromLocation || "Origin"}
                  </span>
                  <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate max-w-[110px] text-foreground">
                    {toLocation || "Destination"}
                  </span>
                </div>
              </div>

              {/* Departure Schedule */}
              <div className="flex items-center gap-2 text-xs text-default-500 py-1 border-y border-default-200/60">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{formattedDeparture}</span>
              </div>

              {/* Perks Badges */}
              {selectedPerks.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedPerks.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-default-100 text-default-700 font-medium border border-default-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & Book Preview Action */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-default-400 block">
                    Fare per ticket
                  </span>
                  <span className="text-xl font-extrabold text-primary">
                    ৳{price ? Number(price).toLocaleString() : "0"}
                  </span>
                </div>

                <Button
                  size="sm"
                  disabled
                  className="bg-default-200 text-default-500 font-bold text-xs px-4 cursor-not-allowed opacity-80"
                >
                  Book Seat
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2: Publishing Policy & Checklist */}
          <Card className="p-5 border border-default-200/80 bg-background shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Route Publishing Guidelines</span>
            </h4>

            <ul className="space-y-2 text-xs text-default-500">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Specify exact boarding point terminal name in the title or
                  from field.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  All listed fares include government road taxes and platform
                  fees.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  New ticket approvals are processed by our admin desk in under
                  2 hours.
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-default-200/60">
              <Link
                href="/dashboard/vendor/tickets"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Check verification status in My Tickets</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 3: Vendor Support Helpline */}
          <Card className="p-4 border border-default-200/80 bg-default-50/70 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-foreground">
                Need Bulk Route Upload?
              </h5>
              <p className="text-[11px] text-default-500">
                Contact vendor operations at{" "}
                <span className="text-primary font-medium">
                  vendor@techbazaar.com
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
