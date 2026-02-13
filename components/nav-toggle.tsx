"use client";

import { useNav } from "./nav-provider";
import { useEffect, useState } from "react";

export function NavToggle() {
  const { position, togglePosition } = useNav();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-12" />;
  }

  return (
    <button
      onClick={togglePosition}
      className="hover:underline cursor-pointer opacity-80 hover:opacity-100"
      title={
        position === "sticky"
          ? "Switch to Static Navigation"
          : "Switch to Sticky Navigation"
      }
    >
      [ {position === "sticky" ? "Sticky Nav" : "Static Nav"} ]
    </button>
  );
}
