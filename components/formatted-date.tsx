"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
  date: Date | string;
  className?: string;
}

export function FormattedDate({ date, className }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    setFormatted(d.toLocaleString());
  }, [date]);

  // Return an empty span or a placeholder during SSR to prevent hydration mismatch
  if (!formatted) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{formatted}</span>;
}
