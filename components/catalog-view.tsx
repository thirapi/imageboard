"use client";

import Link from "next/link";
import { MessageSquare, ImageIcon, Pin, Lock } from "lucide-react";

interface CatalogViewProps {
  threads: any[];
  boardCode: string;
}

export function CatalogView({ threads, boardCode }: CatalogViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-4 gap-y-8">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/${boardCode}/thread/${thread.id}`}
          className="group flex flex-col items-center"
        >
          {/* Thumbnail Container */}
          <div className="relative w-full aspect-square bg-muted/30 border border-muted/50 rounded-md overflow-hidden transition-transform group-hover:scale-[1.03] group-hover:border-accent">
            {thread.image ? (
              <img
                src={thread.image}
                alt={thread.subject || "Thread image"}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                <ImageIcon className="h-10 w-10 stroke-1" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">
                  No Image
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {thread.isPinned && (
                <div className="bg-accent text-white p-1 rounded-sm shadow-md">
                  <Pin className="h-3 w-3 fill-white" />
                </div>
              )}
              {thread.isLocked && (
                <div className="bg-muted-foreground/80 text-white p-1 rounded-sm shadow-md">
                  <Lock className="h-3 w-3 fill-white" />
                </div>
              )}
            </div>

            {/* Reply Count Overly */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <div className="flex items-center justify-between text-white drop-shadow-md">
                <span className="text-[10px] font-bold flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {thread.replyCount}
                </span>
                <span className="text-[9px] font-mono opacity-80 uppercase">
                  {new Date(thread.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-3 w-full text-center space-y-1">
            {thread.subject && (
              <h3 className="text-xs font-bold line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                {thread.subject}
              </h3>
            )}
            <p className="text-[10px] text-muted-foreground line-clamp-3 leading-snug px-1">
              {thread.content}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
