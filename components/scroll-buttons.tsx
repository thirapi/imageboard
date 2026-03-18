"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowTop(window.scrollY > 300);
          setShowBottom(
            window.innerHeight + window.scrollY <
              document.documentElement.scrollHeight - 300
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    
    // Initial check
    const timeoutId = setTimeout(() => {
      setShowTop(window.scrollY > 300);
      setShowBottom(
        window.innerHeight + window.scrollY <
          document.documentElement.scrollHeight - 300
      );
    }, 100);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  if (!showTop && !showBottom) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity focus-within:opacity-100 duration-300 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        {showTop && (
          <Button
            variant="outline"
            size="icon"
            className="rounded bg-card/70 backdrop-blur-sm border-accent/30 hover:bg-accent/10 hover:border-accent hover:text-accent shadow-sm"
            onClick={scrollToTop}
            title="Ke Paling Atas"
          >
            <ArrowUp className="h-4 w-4 opacity-80" />
            <span className="sr-only">Ke Atas</span>
          </Button>
        )}
        {showBottom && (
          <Button
            variant="outline"
            size="icon"
            className="rounded bg-card/70 backdrop-blur-sm border-accent/30 hover:bg-accent/10 hover:border-accent hover:text-accent shadow-sm"
            onClick={scrollToBottom}
            title="Ke Paling Bawah"
          >
            <ArrowDown className="h-4 w-4 opacity-80" />
            <span className="sr-only">Ke Bawah</span>
          </Button>
        )}
      </div>
    </div>
  );
}
