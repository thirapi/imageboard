"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className="h-6 w-6">
        <Sun className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="h-6 w-6"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-3 w-3 text-yellow-400" />
      ) : (
        <Moon className="h-3 w-3" />
      )}
    </Button>
  );
}
