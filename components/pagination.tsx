"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export function Pagination({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const renderPages = () => {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of the current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        pages.push("...");
      }
    }

    // Filter out redundant ellipses
    return pages.filter((page, index, array) => array[index - 1] !== page);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-mono select-none">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="text-accent hover:underline font-bold"
        >
          <span className="hidden sm:inline">[ Sebelumnya ]</span>
          <span className="sm:hidden">[ &lt; ]</span>
        </Link>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2">
        {renderPages().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="text-muted-foreground/40 px-0.5">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = currentPage === pageNum;
          const isExtreme = pageNum === 1 || pageNum === totalPages;
          const isNeighbor = Math.abs(pageNum - currentPage) <= 1;

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={cn(
                "hover:underline min-w-[1rem] sm:min-w-[1.2rem] text-center transition-colors",
                isCurrent
                  ? "text-accent font-bold"
                  : "text-muted-foreground/70 hover:text-accent",
                !isCurrent && !isExtreme && !isNeighbor && "hidden md:inline-block", // Extra spacing logic
                !isCurrent && !isExtreme && !isNeighbor && "hidden sm:inline-block"
              )}
            >
              {isCurrent ? `[ ${pageNum} ]` : pageNum}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="text-accent hover:underline font-bold"
        >
          <span className="hidden sm:inline">[ Selanjutnya ]</span>
          <span className="sm:hidden">[ &gt; ]</span>
        </Link>
      )}
    </div>
  );
}
