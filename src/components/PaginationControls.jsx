"use client";

import { Button } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const PaginationControls = ({ totalPages, currentPage }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <Button
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
      >
        Previous
      </Button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={
          currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
        }
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
