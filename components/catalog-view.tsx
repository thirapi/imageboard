"use client";

import Link from "next/link";
import { MessageSquare, ImageIcon, Pin, Lock } from "lucide-react";

interface CatalogViewProps {
  threads: any[];
  boardCode: string;
}

export function CatalogView({ threads, boardCode }: CatalogViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-x-3 gap-y-6">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/${boardCode}/thread/${thread.id}`}
          className="group flex flex-col items-center"
        >
          {/* Thumbnail Container */}
          <div className="relative w-full aspect-square bg-muted/20 border border-muted/40 rounded shadow-sm overflow-hidden transition-all duration-200 group-hover:scale-[1.02] group-hover:border-accent group-hover:shadow-md">
            {thread.image ? (
              <img
                src={thread.image}
                alt={thread.subject || "Thread image"}
                className="w-full h-full object-cover transition-all duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/20 bg-muted/5 font-mono">
                <ImageIcon className="h-10 w-10 stroke-[1px]" />
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  No Image
                </span>
              </div>
            )}

            {/* Badges (Pinned/Locked) */}
            <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
              {thread.isPinned && (
                <div className="bg-accent text-white p-1 rounded-sm shadow-md backdrop-blur-sm">
                  <Pin className="h-3 w-3 fill-white" />
                </div>
              )}
              {thread.isLocked && (
                <div className="bg-black/60 text-white p-1 rounded-sm shadow-md backdrop-blur-sm">
                  <Lock className="h-3 w-3 fill-white" />
                </div>
              )}
            </div>

            {/* Statistics Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6 translate-y-1 group-hover:translate-y-0 transition-transform">
              <div className="flex items-center justify-between text-white font-mono text-xs font-bold">
                <span className="flex items-center gap-1 drop-shadow-sm">
                  R: {thread.replyCount}
                </span>
                <span className="flex items-center gap-1 opacity-90 text-[10px] font-light">
                  {new Date(thread.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata / Text */}
          <div className="mt-2 w-full text-center space-y-0.5 px-1 font-sans">
            {thread.subject && (
              <h3 className="text-sm font-bold line-clamp-2 leading-snug text-accent group-hover:underline decoration-1 underline-offset-2">
                {thread.subject}
              </h3>
            )}
            <p className="text-[13px] text-muted-foreground line-clamp-3 leading-snug font-medium opacity-90 group-hover:opacity-100 transition-opacity">
              {thread.content}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
