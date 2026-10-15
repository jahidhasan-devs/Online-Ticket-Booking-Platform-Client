"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User2, User2Icon, ChartArea, ChartAreaIcon } from "lucide-react";
import { BiMoney } from "react-icons/bi";
import { TbAsset, TbAssetFilled, TbSquaresSelected } from "react-icons/tb";
import { Bars, House, Xmark } from "@gravity-ui/icons";
import { Button } from "@heroui/react";

export default function DashboardLayout({ children, userRole, userData }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = userRole || "buyer";
  // console.log(role);

  // Navigation Items Routing Map
  const dashboardItems = {
    vendor: [
      { icon: User2, label: "Vendor Profile", link: "/dashboard/vendor" },
      {
        icon: TbAsset,
        label: "Add Ticket",
        link: "/dashboard/vendor/add-ticket",
      },
      {
        icon: TbSquaresSelected,
        label: "My Added Tickets",
        link: "/dashboard/vendor/tickets",
      },
      {
        icon: BiMoney,
        label: "Requested Bookings",
        link: "/dashboard/vendor/requests",
      },
      {
        icon: ChartAreaIcon,
        label: "Revenue Overview",
        link: "/dashboard/vendor/revenue",
      },
    ],

    buyer: [
      { icon: User2Icon, label: "User Profile", link: "/dashboard/buyer" },
      {
        icon: TbAssetFilled,
        label: "My Booked Tickets",
        link: "/dashboard/buyer/booked-tickets",
      },
      {
        icon: BiMoney,
        label: "Transaction History",
        link: "/dashboard/buyer/transaction",
      },
    ],

    admin: [
      { icon: User2, label: "Admin Profile", link: "/dashboard/admin" },
      {
        icon: TbAsset,
        label: "Manage Tickets",
        link: "/dashboard/admin/tickets",
      },
      { icon: User2, label: "Manage Users", link: "/dashboard/admin/users" },
      {
        icon: ChartArea,
        label: "Advertise Tickets",
        link: "/dashboard/admin/advertise",
      },
    ],
  };

  const navItems = dashboardItems[role] || dashboardItems.buyer;

  return (
    <div className="min-h-screen bg-default-50/50 flex flex-col md:flex-row w-full relative">
      {/* ================= Mobile Header ================= */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-default-200 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-default-100 hover:bg-default-200 text-foreground"
          >
            <Bars className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              height={28}
              width={28}
              className="h-7 w-auto object-contain"
              alt="Logo"
            />
            <span className="font-bold text-base capitalize">{role} Panel</span>
          </div>
        </div>
        <Link
          href="/"
          className="p-2 rounded-lg bg-default-100 hover:bg-default-200"
        >
          <House className="w-5 h-5" />
        </Link>
      </header>

      {/* ================= Mobile Drawer Sidebar (Overlay) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-72 max-w-full bg-background h-full shadow-xl p-4 justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-default-200 mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    height={32}
                    width={32}
                    className="h-8 w-auto object-contain"
                    alt="Logo"
                  />
                  <span className="font-bold text-lg capitalize">
                    {role} Dashboard
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-default-100 hover:bg-default-200"
                >
                  <Xmark className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-default-700 hover:bg-primary/10 hover:text-primary">
                        <ItemIcon className="w-5 h-5 text-default-500" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile User Profile Footer */}
            <div className="pt-4 border-t border-default-200">
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-default-100">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  {userData?.name ? userData.name[0].toUpperCase() : "A"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate text-default-800">
                    {userData?.name || "Admin User"}
                  </span>
                  <span className="text-xs text-default-400 truncate">
                    {userData?.email || "admin@example.com"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r border-default-200 min-h-screen sticky top-0 h-screen justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className=" gap-3 px-2 py-1">
            <Image
              src="/logo.png"
              height={40}
              width={40}
              className="h-10 w-auto object-contain"
              alt="Logo"
            />
            <div>
              <p className="text-xs text-default-400 capitalize">
                {role} Panel
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link key={item.label} href={item.link}>
                  <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-default-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary">
                    <ItemIcon className="w-5 h-5 text-default-500" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-default-200">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-default-100">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
              {userData?.name ? userData.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-default-800">
                {userData?.name || "Admin User"}
              </span>
              <span className="text-xs text-default-400 truncate">
                {userData?.email || "admin@example.com"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= Main Content Area ================= */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-default-200/60">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-default-900 capitalize">
                Welcome back, {userData?.name?.split(" ")[0] || "Admin"} 👋
              </h2>
              <p className="text-sm text-default-500 mt-1">
                Here is an overview of your {role} dashboard
              </p>
            </div>
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 text-sm text-default-600 hover:text-primary transition-colors"
            >
              <House className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
