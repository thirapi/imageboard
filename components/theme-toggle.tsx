"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-6" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hover:underline cursor-pointer opacity-80 hover:opacity-100"
      title={
        resolvedTheme === "dark"
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
    >
      [ {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"} ]
    </button>
  );
}
