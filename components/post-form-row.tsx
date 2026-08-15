import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PostFormRowProps {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function PostFormRow({
  label,
  htmlFor,
  className,
  children,
}: PostFormRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-bold opacity-70 sm:w-20 sm:shrink-0 sm:text-left sm:text-xs whitespace-nowrap"
      >
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
