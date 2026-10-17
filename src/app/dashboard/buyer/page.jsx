import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, Avatar, Chip } from "@heroui/react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Fingerprint,
} from "lucide-react";

export const metadata = {
  title: "My Profile | TechBazaar",
  description: "View your account information and profile details",
};

export default async function UserProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold">
            Please log in to view your profile
          </h2>
        </Card>
      </div>
    );
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
      label: "Account Role",
      value: user.role || "User",
      icon: ShieldCheck,
    },
    {
      label: "User ID",
      value: user.id || "Not available",
      icon: Fingerprint,
    },
    {
      label: "Email Verification",
      value: user.emailVerified ? "Verified" : "Not verified",
      icon: Mail,
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
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          View your personal information and account details.
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-neutral-900 dark:to-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <Card.Content className="p-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar size="lg">
              <Avatar.Image
                src={user.image || undefined}
                alt={user.name || "User Avatar"}
                referrerPolicy="no-referrer"
              />
              <Avatar.Fallback>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar.Fallback>
            </Avatar>

            <div className="text-center sm:text-left space-y-3">
              <h2 className="text-2xl font-bold">{user.name || "User Name"}</h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Chip size="sm" variant="primary">
                  {(user.role || "User").toString()}
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

      {/* User Information */}
      <Card className="p-6 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl">
        <Card.Header className="px-0 pt-0 pb-5">
          <div>
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your registered account information.
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
    </div>
  );
}
