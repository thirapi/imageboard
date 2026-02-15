"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, className }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div
        className={cn(
          "aspect-video w-full max-w-[480px] bg-black rounded-lg overflow-hidden",
          className,
        )}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={cn("inline-block align-top my-2", className)}>
      <div className="text-xs text-muted-foreground mb-1 font-mono">
        [YouTube] {title || `Video ID: ${videoId}`}
      </div>
      <button
        onClick={() => setIsPlaying(true)}
        className="group relative block w-full max-w-[320px] aspect-video bg-black rounded-lg overflow-hidden ring-1 ring-border hover:ring-accent transition-all"
        aria-label={`Play video ${title || videoId}`}
      >
        {/* Thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt={title || "Video Thumbnail"}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
          <div className="w-14 h-14 bg-black/60 backdrop-blur-[2px] rounded-full flex items-center justify-center border border-white/20 group-hover:bg-accent/80 group-hover:border-white/40 transition-all duration-300">
            <Play className="w-6 h-6 text-white fill-white ml-1 opacity-90" />
          </div>
        </div>
      </button>
    </div>
  );
}
