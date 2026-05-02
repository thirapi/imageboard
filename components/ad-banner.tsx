"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  slot?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

export function AdBanner({ 
  slot, 
  className, 
  format = "auto", 
  responsive = true 
}: AdBannerProps) {
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement || adElement.dataset.adsbygoogleStatus === "done") return;

    const pushAd = () => {
      try {
        if (adElement.offsetWidth > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          return true;
        }
      } catch (err) {
        // Suppress errors related to push or double initialization
      }
      return false;
    };

    if (!pushAd()) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            if (pushAd()) {
              observer.unobserve(adElement);
              observer.disconnect();
              break;
            }
          }
        }
      });
      observer.observe(adElement);
      return () => observer.disconnect();
    }
  }, []);

  // For testing/preview if no slot is provided or in dev mode
  const isDev = process.env.NODE_ENV === "development";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!publisherId && !slot) {
    if (isDev) {
      return (
        <div 
          className={cn(
            "my-4 mx-auto flex items-center justify-center rounded-sm overflow-hidden",
            "w-full max-w-[728px] h-[50px] sm:h-[90px]", 
            className
          )}
        >
          <div className="text-center opacity-40">
            <p className="text-[10px] font-mono uppercase tracking-widest">Advertisement Space</p>
            <p className="text-[11px] italic">banners or ads goes here</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn("my-4 mx-auto overflow-hidden text-center", className)}>
      <p className="text-[9px] text-muted-foreground/40 mb-1 hidden sm:block">Advertisement</p>
      <ins
        ref={adRef as React.RefObject<HTMLModElement>}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "50px" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
