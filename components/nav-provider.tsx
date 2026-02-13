"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type NavPosition = "static" | "sticky";

interface NavContextType {
  position: NavPosition;
  togglePosition: () => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState<NavPosition>("static");

  useEffect(() => {
    const saved = localStorage.getItem("ib-nav-position") as NavPosition;
    if (saved === "sticky") {
      setPosition("sticky");
    }
  }, []);

  const togglePosition = () => {
    const newPos = position === "static" ? "sticky" : "static";
    setPosition(newPos);
    localStorage.setItem("ib-nav-position", newPos);
  };

  return (
    <NavContext.Provider value={{ position, togglePosition }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
}
