"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-12">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <div className="flex items-center gap-1 font-mono text-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first 3, last 3, and surrounding current page
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Link key={page} href={createPageUrl(page)}>
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page && "pointer-events-none",
                  )}
                >
                  {page}
                </Button>
              </Link>
            );
          }

          // Show ellipse
          if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="text-muted-foreground px-1">
                ...
              </span>
            );
          }

          return null;
        })}
      </div>

      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
