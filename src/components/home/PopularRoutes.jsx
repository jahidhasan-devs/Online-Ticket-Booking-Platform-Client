const routes = [
  {
    from: "Dhaka",
    to: "Cox's Bazar",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  },
  {
    from: "Dhaka",
    to: "Sylhet",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  },
  {
    from: "Chittagong",
    to: "Saint Martin",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
  },
  {
    from: "Dhaka",
    to: "Rajshahi",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80",
  },
];

export default function PopularRoutes() {
  return (
    <section className="mt-20">
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Popular Routes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {routes.map((route) => (
          <div
            key={route.from + route.to}
            className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              src={route.image}
              alt={`${route.from} to ${route.to}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold text-lg">
                {route.from} → {route.to}
              </p>
              <p className="text-sm opacity-90">From ৳{route.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
