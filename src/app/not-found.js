"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-xl text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="select-none text-[130px] font-black leading-none tracking-tighter text-gray-200 dark:text-gray-800 sm:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-200 bg-white/90 shadow-xl shadow-blue-500/10 dark:border-gray-700 dark:bg-gray-900/90 sm:h-24 sm:w-24">
              <Compass
                size={48}
                strokeWidth={1.5}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Page Not Found
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Oops! Lost your way?
          </h2>

          <p className="mx-auto max-w-md text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
            The page you are looking for doesn't exist, may have been moved, or
            is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Search size={15} />
            Check the URL or return to the homepage.
          </p>
        </div>
      </section>
    </main>
  );
}
