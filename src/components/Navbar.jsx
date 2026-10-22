"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  Bus,
  Train,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ThemingToggle from "./ThemingToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const pathname = usePathname();

  // Dashboard পেজে থাকলে Navbar হাইড থাকবে
  if (pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-black p-1 text-white text-sm">
        <marquee>
          🎉 Book Online & Get Up to 5% Instant Discount | 📱 Get Instant SMS &
          E-Ticket | 💳 Card & bKash Payment Available
        </marquee>
      </div>

      {/* Main Navbar with White/Glass Blur Effect */}
      <nav className="w-full border-b border-separator/40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-xs transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Side: Brand Logo & Mobile Hamburger Icon */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-foreground hover:opacity-80 transition-opacity"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <Image
                height={150}
                width={150}
                loading="eager"
                src="/logo.png"
                alt="TicketBari Logo"
                className="rounded h-10 w-auto"
              />
            </Link>
          </div>

          {/* Center Links (Desktop View) */}
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Link
                href="/"
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tickets"
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                All Tickets
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href={`/dashboard/${user?.role || "user"}`}
                  className="font-medium text-foreground hover:text-accent transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side: Theme Toggle & User Auth Options */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center">
              <ThemingToggle />
            </div>

            {/* Logged Out View: Login & Register */}
            {!user && (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/signin"
                  className="font-medium text-foreground hover:text-accent transition-colors px-3 py-1.5"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Logged In View: User Avatar + Name + Dropdown */}
            {user && (
              <div className="hidden items-center gap-3 md:flex">
                <Dropdown>
                  <Dropdown.Trigger className="rounded-full focus:outline-hidden cursor-pointer">
                    <div className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-default-100 transition-colors border border-transparent hover:border-separator">
                      <Avatar size="sm">
                        <Avatar.Image
                          referrerPolicy="no-referrer"
                          alt={user?.name || "User Avatar"}
                          src={user?.image}
                        />
                        <Avatar.Fallback>
                          {user?.name?.charAt(0) || "U"}
                        </Avatar.Fallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">
                        {user?.name}
                      </span>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover>
                    <div className="px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <Avatar.Image alt={user?.name} src={user?.image} />
                          <Avatar.Fallback delayMs={600}>
                            {user?.name?.charAt(0) || "U"}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                          <p className="text-sm font-medium leading-5">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted leading-none">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Dropdown.Menu
                      onAction={(key) => console.log(`Selected: ${key}`)}
                    >
                      <Dropdown.Item id="profile" textValue="My Profile">
                        <Link
                          className="flex items-center gap-2 w-full text-foreground"
                          href={`/dashboard/${user?.role}`}
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        id="logout"
                        textValue="Logout"
                        variant="danger"
                        onClick={handleSignOut}
                      >
                        <div className="flex items-center gap-2 text-danger w-full cursor-pointer">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-separator/40 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
            <ul className="flex flex-col gap-2 p-4">
              <li>
                <Link
                  href="/"
                  className="block py-2 font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  className="block py-2 font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Tickets
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      href={`/dashboard/${user?.role || "user"}`}
                      className="block py-2 font-medium text-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="block py-2 font-medium hover:text-accent transition-colors"
                      onClick={() => iskiMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li className="mt-2 border-t border-separator/40 pt-3">
                    <div className="flex items-center gap-3 pb-2">
                      <Avatar size="sm">
                        <Avatar.Image src={user?.image} alt={user?.name} />
                        <Avatar.Fallback>
                          {user?.name?.charAt(0) || "U"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      className="w-full mt-2"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <li className="mt-2 flex flex-col gap-2 border-t border-separator/40 pt-4">
                  <Link
                    href="/signin"
                    className="block py-2 text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
