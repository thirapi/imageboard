"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
  const adRef = useRef<HTMLInsElement>(null);

  useEffect(() => {
    const adElement = adRef.current;
    if (adElement && adElement.dataset.adsbygoogleStatus !== "done") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, []);

  // For testing/preview if no slot is provided or in dev mode
  const isDev = process.env.NODE_ENV === "development";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!publisherId && !slot) {
    // Only show placeholder in development mode to help with layout planning
    if (isDev) {
      return (
        <div 
          className={cn(
            "my-4 mx-auto flex items-center justify-center rounded-sm overflow-hidden",
            "w-full max-w-[728px] h-[90px] sm:h-[90px] h-[50px]", 
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
    
    // Hide completely in production if no credentials are set
    return null;
  }

  return (
    <div className={cn("my-4 mx-auto overflow-hidden text-center", className)}>
      <p className="text-[9px] text-muted-foreground/40 mb-1 hidden sm:block">Advertisement</p>
      <ins
        ref={adRef}
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
