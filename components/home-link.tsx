"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HomeLink() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/"
          className="opacity-80 hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Home className="size-3.5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom">Beranda</TooltipContent>
    </Tooltip>
  );
}
