"use client";

import { useNav } from "./nav-provider";
import { cn } from "@/lib/utils";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { position } = useNav();

  return (
    <nav
      className={cn(
        "border-b bg-muted/30 py-1 px-4 text-[11px] font-mono flex items-center justify-between transition-all duration-300",
        position === "sticky"
          ? "sticky top-0 z-[100] backdrop-blur-md bg-muted/80"
          : "static",
      )}
    >
      {children}
    </nav>
  );
}
