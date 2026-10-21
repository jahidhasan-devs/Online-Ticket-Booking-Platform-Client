"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, CreditCard } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    /* slate-900 ব্যাকগ্রাউন্ড এবং টেক্সট সাদা কালার করা হয়েছে */
    <footer className="mt-16 bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo + Short Description */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="TicketBari Logo"
                width={180}
                height={50}
                className="h-12 w-auto brightness-0 invert" /* ডার্ক ব্যাকগ্রাউন্ডের জন্য লোগো যদি ডার্ক হয় সাদা করার জন্য */
              />
            </Link>

            <p className="mt-4 text-sm text-slate-400">
              Book bus, train, launch & flight tickets easily
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-700 p-2 transition hover:bg-slate-800"
              >
                <FaFacebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-white">
                  All Tickets
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h3>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@ticketbari.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+880 12xxxxx890</span>
              </div>

              <div className="flex items-center gap-3">
                <FaFacebook className="h-4 w-4 shrink-0" />
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Facebook Page
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Payment Methods
            </h3>

            <div className="space-y-3 text-sm text-slate-400">
              <p>Secure online transactions powered by:</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 font-medium text-white bg-slate-800">
                  <CreditCard className="h-4 w-4" /> Stripe
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
          <p>© 2025 TicketBari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
