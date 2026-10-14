"use client";

import Link from "next/link";
import { Bus, Ship, Train, Plane } from "lucide-react";

const featuredTickets = [
  {
    id: 1,
    title: "Dhaka → Cox's Bazar (AC Bus)",
    price: 1250,
    quantity: 14,
    transportType: "Bus",
    perks: ["AC", "WiFi", "Charging Port"],
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    id: 2,
    title: "Dhaka → Sylhet (Luxury Launch)",
    price: 1850,
    quantity: 22,
    transportType: "Launch",
    perks: ["Cabin", "Dinner", "AC"],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    id: 3,
    title: "Chittagong → Saint Martin",
    price: 2400,
    quantity: 8,
    transportType: "Ship",
    perks: ["Deck View", "Life Jacket"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: 4,
    title: "Dhaka → Rajshahi (Train)",
    price: 680,
    quantity: 35,
    transportType: "Train",
    perks: ["Shovon Chair", "Food"],
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
  },
  {
    id: 5,
    title: "Dhaka → Bandarban",
    price: 950,
    quantity: 19,
    transportType: "Bus",
    perks: ["Window Seat", "Music"],
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    id: 6,
    title: "Dhaka → Bangkok (Flight)",
    price: 18900,
    quantity: 5,
    transportType: "Flight",
    perks: ["20kg Baggage", "Meal"],
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
];

const transportIcons = {
  Bus: Bus,
  Launch: Ship,
  Ship: Ship,
  Train: Train,
  Flight: Plane,
};

const FeaturedTickets = () => {
  return (
    <section className="mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
          Featured Tickets
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Handpicked by Admin • Limited seats available
        </p>
      </div>

      {/* Cards Grid - Exactly 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTickets.map((ticket) => {
          const Icon = transportIcons[ticket.transportType] || Bus;

          return (
            <div
              key={ticket.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Transport Type Badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Icon size={13} />
                  {ticket.transportType}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Ticket Title */}
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-2 mb-3">
                  {ticket.title}
                </h3>

                {/* Price + Quantity */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{ticket.price.toLocaleString()}
                    <span className="text-sm font-normal text-zinc-500 ml-1">
                      /unit
                    </span>
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {ticket.quantity} left
                  </span>
                </div>

                {/* Perks */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {ticket.perks.map((perk) => (
                    <span
                      key={perk}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-md"
                    >
                      {perk}
                    </span>
                  ))}
                </div>

                {/* See Details Button */}
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
                >
                  See Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedTickets;
