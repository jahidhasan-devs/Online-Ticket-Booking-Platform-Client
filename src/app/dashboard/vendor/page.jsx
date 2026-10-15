
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, Avatar, Chip, Button } from "@heroui/react";
import {
  Store,
  Mail,
  ShieldCheck,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  Settings,
  ExternalLink,
  Plus,
} from "lucide-react";

export const metadata = {
  title: "Vendor Profile & Dashboard | TechBazaar",
  description: "Vendor profile details, overview metrics, and store operations",
};

export default async function SellerDashboardHomepage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  console.log(user);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vendor Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here is an overview of your store performance and
            profile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Storefront
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Hero Section: Vendor Profile Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-neutral-900 dark:to-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <Card.Content className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-0">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <Avatar size="sm">
              <Avatar.Image
                referrerPolicy="no-referrer"
                alt={user?.name || "User Avatar"}
                src={user?.image}
              />
              <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
            </Avatar>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">
                  {user?.name || "Vendor Name"}
                </h2>
                <Chip size="sm" variant="primary" className="capitalize">
                  {user?.role || "Vendor"}
                </Chip>
                <Chip
                  size="sm"
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  Verified Store
                </Chip>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user?.email || "vendor@techbazaar.com"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-gray-400" />
                  TechBazaar Store
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Account Active
                </span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Store Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-gray-200 dark:border-neutral-800 shadow-sm">
          <Card.Content className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold mt-1">$12,480.00</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                +14.2% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="p-5 border border-gray-200 dark:border-neutral-800 shadow-sm">
          <Card.Content className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold mt-1">324</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                +8.1% from last week
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="p-5 border border-gray-200 dark:border-neutral-800 shadow-sm">
          <Card.Content className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Active Products
              </p>
              <h3 className="text-2xl font-bold mt-1">48</h3>
              <p className="text-xs text-gray-500 mt-1">4 out of stock</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </Card.Content>
        </Card>

        <Card className="p-5 border border-gray-200 dark:border-neutral-800 shadow-sm">
          <Card.Content className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Store Rating
              </p>
              <h3 className="text-2xl font-bold mt-1">4.8 / 5.0</h3>
              <p className="text-xs text-gray-500 mt-1">Based on 142 reviews</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Quick Action / Operational Overview Section */}
      <Card className="p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
        <Card.Header className="px-0 pt-0 pb-4">
          <h3 className="text-lg font-semibold">Vendor Quick Actions</h3>
        </Card.Header>
        <Card.Content className="p-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
            <h4 className="font-semibold text-sm">Manage Products</h4>
            <p className="text-xs text-gray-500 mt-1">
              Add new inventory, update pricing, and edit product listings.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
            <h4 className="font-semibold text-sm">Order Fulfillment</h4>
            <p className="text-xs text-gray-500 mt-1">
              View pending shipments, update tracking, and manage returns.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
            <h4 className="font-semibold text-sm">Store Settings</h4>
            <p className="text-xs text-gray-500 mt-1">
              Configure store details, payment methods, and notification
              preferences.
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
