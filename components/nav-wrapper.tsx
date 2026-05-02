"use client";

import { useNav } from "./nav-provider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { position } = useNav();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={cn(
        "border-b px-2 sm:px-4 py-1 text-[11px] font-mono bg-muted/30",
        mounted && position === "sticky"
          ? "sticky top-0 z-50 backdrop-blur-md bg-muted/80"
          : ""
      )}
    >
      {children}
    </nav>
  );
}