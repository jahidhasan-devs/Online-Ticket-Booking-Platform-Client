import Banner from "@/components/home/Banner";
import FeaturedTickets from "@/components/home/FeaturedTickets";

import LatestTickets from "@/components/home/LatestTickets";
import PopularRoutes from "@/components/home/PopularRoutes";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { getAdvertisedTickets } from "@/lib/api/product";

export default async function  HomePage() {

const advertisedTickets = await getAdvertisedTickets();
  
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Banner */}
        <Banner />

        {/* Advertisement / Featured (Admin Selected 6) */}
        <FeaturedTickets tickets={advertisedTickets} />

        {/* Latest Tickets */}
        <LatestTickets />

        {/* Extra Section 1 */}
        <PopularRoutes />

        {/* Extra Section 2 */}
        <WhyChooseUs />
      </div>
    </main>
  );
}
