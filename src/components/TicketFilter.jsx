"use client";

import { Button, Input } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

const TicketFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [transportType, setTransportType] = useState(
    searchParams.get("transportType") || "all",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const handleFilter = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (from) params.set("from", from);
    else params.delete("from");

    if (to) params.set("to", to);
    else params.delete("to");

    if (transportType && transportType !== "all")
      params.set("transportType", transportType);
    else params.delete("transportType");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setTransportType("all");
    setSort("");
    router.push(pathname);
  };

  return (
    <form
      onSubmit={handleFilter}
      className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl mb-10 transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
        {/* From Location */}
        <Input
          label="From"
          placeholder="Departure City (e.g. Mymensingh)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          size="sm"
          classNames={{
            inputWrapper:
              "bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-black dark:focus-within:!border-white rounded-xl transition-all",
            label:
              "text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide text-xs mb-1",
            input:
              "text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm",
          }}
        />

        {/* To Location */}
        <Input
          label="To"
          placeholder="Destination City (e.g. Dhaka)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          size="sm"
          classNames={{
            inputWrapper:
              "bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-black dark:focus-within:!border-white rounded-xl transition-all",
            label:
              "text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide text-xs mb-1",
            input:
              "text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm",
          }}
        />

        {/* Transport Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
            Transport Type
          </label>
          <select
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-500 focus:border-black dark:focus:border-white transition-all cursor-pointer"
          >
            <option
              value="all"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              All Transports
            </option>
            <option
              value="Bus"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Bus
            </option>
            <option
              value="Train"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Train
            </option>
            <option
              value="Flight"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Flight
            </option>
            <option
              value="Launch"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Launch
            </option>
          </select>
        </div>

        {/* Sort by Price Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
            Sort by Price
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-500 focus:border-black dark:focus:border-white transition-all cursor-pointer"
          >
            <option
              value=""
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Default
            </option>
            <option
              value="lowToHigh"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Price: Low to High
            </option>
            <option
              value="highToLow"
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Price: High to Low
            </option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          size="sm"
          type="button"
          onClick={handleReset}
          className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl px-5 font-medium transition-all"
        >
          Reset
        </Button>
        <Button
          size="sm"
          type="submit"
          className="bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 rounded-xl px-6 transition-all shadow-md"
        >
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default TicketFilter;
