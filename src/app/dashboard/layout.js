

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardSidebar from "@/components/dashboard/DasboardSidebar";

export default async function DashboardLayout({ children }) {
  // সার্ভার থেকে ইউজারের সেশন ফেচ করা হচ্ছে
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "buyer";

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar Component with Props */}
      <DashboardSidebar userRole={role} userData={user} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8 mt-12 md:mt-0 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}