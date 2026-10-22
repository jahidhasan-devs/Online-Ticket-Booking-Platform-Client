"use client";

import Link from "next/link";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-6">
          <h1 className="text-9xl font-black tracking-tighter text-gray-200 dark:text-gray-800 sm:text-[160px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <Compass size={42} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
          Page Not Found
        </p>

        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Oops! Lost your way?
        </h2>

        <p className="mx-auto mb-8 max-w-md leading-7 text-gray-600 dark:text-gray-400">
          Sorry, the page you are looking for does not exist or may have been
          moved to another location.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-500 dark:text-gray-500">
          Please check the URL and try again.
        </p>
      </div>
    </main>
  );
}
