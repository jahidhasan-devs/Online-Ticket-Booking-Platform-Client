import { ShieldCheck, Zap, Headphones, BadgeDollarSign } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected transactions with trusted gateways",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    desc: "Get your e-ticket immediately after payment",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our team is always ready to help you",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    desc: "Find cheaper? We’ll match the price",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mt-20 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
          Why Choose Us?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Thousands of travelers trust us every day
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-4">
              <item.icon
                className="text-blue-600 dark:text-blue-400"
                size={28}
              />
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
