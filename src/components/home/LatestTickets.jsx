"use client";

import Link from "next/link";
import { Card, CardFooter, Button, Chip } from "@heroui/react";
import { Bus, Train, Plane, Ship, Ticket, ArrowRight } from "lucide-react";

// ========== DEMO DATA ==========
const latestTickets = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    title: "Dhaka → Cox's Bazar Express",
    price: 1850,
    quantity: 24,
    transportType: "Bus",
    perks: ["AC", "Free WiFi", "Snacks", "Reclining Seat"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
    title: "Dhaka → Sylhet Flight",
    price: 4200,
    quantity: 12,
    transportType: "Flight",
    perks: ["Baggage 20kg", "Meal", "Priority Boarding"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop",
    title: "Chittagong → Dhaka Intercity",
    price: 950,
    quantity: 48,
    transportType: "Train",
    perks: ["AC Chair", "Food Service", "Charging Point"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
    title: "Saint Martin Island Package",
    price: 3200,
    quantity: 15,
    transportType: "Ship",
    perks: ["Return Ticket", "Lunch", "Insurance"],
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    title: "Dhaka → Bandarban Adventure",
    price: 2100,
    quantity: 18,
    transportType: "Bus",
    perks: ["AC", "Tour Guide", "Breakfast"],
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
    title: "Rajshahi → Dhaka Night Coach",
    price: 1100,
    quantity: 32,
    transportType: "Bus",
    perks: ["Sleeper", "Blanket", "Water"],
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop",
    title: "Dhaka → Bangkok Direct",
    price: 18500,
    quantity: 8,
    transportType: "Flight",
    perks: ["Baggage 30kg", "Meal", "Entertainment"],
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    title: "Khulna → Mongla Port",
    price: 450,
    quantity: 40,
    transportType: "Ship",
    perks: ["Deck Seat", "Refreshment"],
  },
];

// Transport icon + color mapping (Pure JavaScript Object)
const transportConfig = {
  Bus: {
    icon: Bus,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  Train: {
    icon: Train,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  Flight: {
    icon: Plane,
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  Ship: {
    icon: Ship,
    className:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
};

export default function LatestTickets() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:3xl font-bold tracking-tight">
                Latest Tickets
              </h2>
              <p className="text-sm text-default-500 mt-0.5">
                Recently added tickets — book before they sell out
              </p>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {latestTickets.map((ticket) => {
            const config = transportConfig[ticket.transportType];
            const TransportIcon = config?.icon || Bus;

            return (
              <Card
                key={ticket.id}
                className="group overflow-hidden border border-default-200 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Transport Badge */}
                  <div className="absolute top-3 left-3">
                    <Chip
                      size="sm"
                      variant="soft"
                      className={`flex items-center gap-1 px-2 ${config?.className}`}
                    >
                      <TransportIcon className="w-3.5 h-3.5 inline-block" />
                      <span>{ticket.transportType}</span>
                    </Chip>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col gap-3">
                  {/* Title */}
                  <h3 className="font-semibold text-base line-clamp-2 leading-snug">
                    {ticket.title}
                  </h3>

                  {/* Price + Quantity */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        ৳{ticket.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-default-400 ml-1">
                        / unit
                      </span>
                    </div>
                    <Chip size="sm" variant="soft">
                      {ticket.quantity} left
                    </Chip>
                  </div>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-1.5">
                    {ticket.perks.slice(0, 3).map((perk) => (
                      <Chip
                        key={perk}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                      >
                        {perk}
                      </Chip>
                    ))}
                    {ticket.perks.length > 3 && (
                      <span className="text-xs text-default-400 self-center">
                        +{ticket.perks.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* CardFooter */}
                <CardFooter className="pt-0 px-4 pb-4">
                  <Link href={`/ticket/${ticket.id}`} className="w-full">
                    <Button
                      variant="primary"
                      fullWidth
                      className="font-medium flex items-center justify-center gap-2"
                    >
                      <span>See details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
