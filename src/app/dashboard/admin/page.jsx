import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, Avatar, Chip } from "@heroui/react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Fingerprint,
  LockKeyhole,
  Settings,
} from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Profile | TechBazaar",
  description: "Admin account information and profile details",
};

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  // console.log("For verification check",user);

  if (!user) {
    redirect("/login");
  }

  // Protect this page from non-admin users.
  if (user.role !== "admin") {
    redirect("/");
  }

  const profileItems = [
    {
      label: "Full Name",
      value: user.name || "Not provided",
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: user.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Admin Role",
      value: user.role || "Admin",
      icon: ShieldCheck,
    },
    {
      label: "User ID",
      value: user.id || "Not available",
      icon: Fingerprint,
    },
    {
      label: "Email Verification",
      value: user.emailVerified ? "Email Not Verified" : "Email Verified",
      icon: LockKeyhole,
    },
    {
      label: "Account Created",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "Not available",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            View your administrator account and personal information.
          </p>
        </div>

        <Chip
          size="sm"
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
        >
          <ShieldCheck className="w-4 h-4 mr-1" />
          Administrator
        </Chip>
      </div>

      {/* Admin Profile Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-neutral-900 dark:to-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <Card.Content className="p-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar size="lg">
              <Avatar.Image
                src={user.image || undefined}
                alt={user.name || "Admin Avatar"}
                referrerPolicy="no-referrer"
              />
              <Avatar.Fallback>
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar.Fallback>
            </Avatar>

            <div className="text-center sm:text-left space-y-3">
              <h2 className="text-2xl font-bold">
                {user.name || "Admin Name"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Chip size="sm" variant="primary">
                  {user.role}
                </Chip>

                <Chip
                  size="sm"
                  variant="secondary"
                  className={
                    user.emailVerified
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }
                >
                  {user.emailVerified ? "Email Not Verified" : "Email Verified"}
                </Chip>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Admin Information */}
      <Card className="p-6 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl">
        <Card.Header className="px-0 pt-0 pb-5">
          <div>
            <h3 className="text-xl font-semibold">Administrator Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your registered account details.
            </p>
          </div>
        </Card.Header>

        <Card.Content className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-neutral-800"
                >
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="font-medium mt-1 break-words">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* Admin Access Information */}
      <Card className="p-6 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl">
        <Card.Content className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Settings className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">Admin Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your administrator account provides access to authorized
                management features according to your assigned permissions.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
