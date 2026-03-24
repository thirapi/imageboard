"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type NavPosition = "static" | "sticky";
type BoardView = "list" | "catalog";

interface NavContextType {
  position: NavPosition;
  togglePosition: () => void;
  defaultBoardView: BoardView;
  toggleDefaultBoardView: () => void;
  autoPlayGif: boolean;
  toggleAutoPlayGif: () => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState<NavPosition>("static");
  const [defaultBoardView, setDefaultBoardView] = useState<BoardView>("list");
  const [autoPlayGif, setAutoPlayGif] = useState<boolean>(true);

  useEffect(() => {
    const savedPos = localStorage.getItem("ib-nav-position") as NavPosition;
    if (savedPos === "sticky") {
      setPosition("sticky");
    }
    
    const savedView = localStorage.getItem("ib-default-board-view") as BoardView;
    if (savedView === "catalog") {
      setDefaultBoardView("catalog");
    }

    const savedAutoPlay = localStorage.getItem("ib-autoplay-gif");
    if (savedAutoPlay === "false") {
      setAutoPlayGif(false);
    }
  }, []);

  const togglePosition = () => {
    const newPos = position === "static" ? "sticky" : "static";
    setPosition(newPos);
    localStorage.setItem("ib-nav-position", newPos);
  };

  const toggleDefaultBoardView = () => {
    const newView = defaultBoardView === "list" ? "catalog" : "list";
    setDefaultBoardView(newView);
    localStorage.setItem("ib-default-board-view", newView);
  };

  const toggleAutoPlayGif = () => {
    const newVal = !autoPlayGif;
    setAutoPlayGif(newVal);
    localStorage.setItem("ib-autoplay-gif", String(newVal));
  };

  return (
    <NavContext.Provider 
      value={{ 
        position, 
        togglePosition, 
        defaultBoardView, 
        toggleDefaultBoardView,
        autoPlayGif,
        toggleAutoPlayGif
      }}
    >
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
