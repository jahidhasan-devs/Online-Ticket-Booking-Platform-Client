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
    <DashboardSidebar userRole={role} userData={user}>
      {children}
    </DashboardSidebar>
  );
}
