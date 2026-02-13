"use client";

import { useState } from "react";
import { Maximize2, Minimize2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableImageProps {
  src: string;
  alt: string;
  metadata?: string;
  onFullScreen?: () => void;
  className?: string;
  isOP?: boolean;
  isNsfw?: boolean;
  isSpoiler?: boolean;
}

export function ExpandableImage({
  src,
  alt,
  metadata,
  onFullScreen,
  className,
  isOP = false,
  isNsfw = false,
  isSpoiler = false,
}: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNsfw, setShowNsfw] = useState(!isNsfw);
  const [showSpoiler, setShowSpoiler] = useState(!isSpoiler);

  const isHidden = !showNsfw || !showSpoiler;

  // Helper to parse metadata (taking the filename part)
  const filename = metadata ? metadata.split(" (")[0] : "image";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 mb-2",
        isExpanded ? "w-full" : "w-fit max-w-full",
        className,
      )}
    >
      {/* Metadata & Actions */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span
          className={cn(
            "truncate max-w-[150px] sm:max-w-[300px] font-mono opacity-70 hover:opacity-100 transition-opacity cursor-default",
            isNsfw && "text-destructive font-bold",
            isSpoiler && "text-yellow-600 dark:text-yellow-500 font-bold",
          )}
          title={metadata}
        >
          {isNsfw && `[NSFW] `}
          {isSpoiler && `[SPOILER] `}
          {metadata || "image.png"}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFullScreen?.();
            }}
            className="hover:text-accent hover:underline flex items-center gap-0.5"
          >
            [full-view]
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent hover:underline flex items-center gap-0.5"
          >
            [source]
          </a>
        </div>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          "relative group cursor-zoom-in overflow-hidden rounded-sm border shadow-sm transition-all duration-300",
          isExpanded ? "w-full cursor-zoom-out" : "w-fit",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-all duration-300",
            isHidden && "blur-2xl scale-110",
            isExpanded
              ? "w-full h-auto object-contain max-h-[85vh]"
              : cn(
                  "object-contain",
                  isOP
                    ? "max-w-[200px] max-h-[200px] sm:max-w-[300px] sm:max-h-[300px]"
                    : "max-w-[150px] max-h-[150px] sm:max-w-[250px] sm:max-h-[250px]",
                ),
          )}
        />

        {/* Overlay - Classic Imageboard Style */}
        {isHidden && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity hover:bg-black/40 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowNsfw(true);
              setShowSpoiler(true);
            }}
          >
            {!showNsfw ? (
              <div className="border border-destructive bg-black px-4 py-2 text-destructive font-mono text-[12px] font-bold tracking-tight uppercase">
                [ NSFW CONTENT ]
              </div>
            ) : (
              <div className="border border-yellow-500 bg-black px-4 py-2 text-yellow-500 font-mono text-[12px] font-bold tracking-tight uppercase">
                [ SPOILER ]
              </div>
            )}
          </div>
        )}

        {/* Hover Indicator */}
        <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </div>
      </div>
    </div>
  );
}
