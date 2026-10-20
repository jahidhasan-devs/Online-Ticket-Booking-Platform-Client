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

  if (!user) {
    redirect("/login");
  }

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
      value: user.emailVerified ? "Email Verified" : "Email Not Verified",
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
    <div className="mx-auto max-w-5xl space-y-8 bg-white p-4 text-gray-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-white sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            View your administrator account and personal information.
          </p>
        </div>

        <Chip
          size="sm"
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
        >
          <ShieldCheck className="mr-1 h-4 w-4" />
          Administrator
        </Chip>
      </div>

      {/* Admin Profile Card */}
      <Card className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900 sm:p-8">
        <Card.Content className="p-0">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
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

            <div className="space-y-3 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name || "Admin Name"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {user.email}
              </p>

              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
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
                  {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                </Chip>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Administrator Information */}
      <Card className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white sm:p-6">
        <Card.Header className="px-0 pb-5 pt-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Administrator Information
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Your registered account details.
            </p>
          </div>
        </Card.Header>

        <Card.Content className="p-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profileItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-colors dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* Admin Access Information */}
      <Card className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white sm:p-6">
        <Card.Content className="p-0">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <Settings className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Access
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
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
