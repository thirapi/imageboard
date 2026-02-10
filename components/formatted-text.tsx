"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getPostByNumber } from "@/lib/actions/home.actions";
import type { PostInfoEntity } from "@/lib/entities/post.entity";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
  content: string;
  className?: string;
}

export function FormattedText({ content, className }: FormattedTextProps) {
  const lines = content.split("\n");

  return (
    <div className={cn("whitespace-pre-wrap break-words font-sans", className)}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <TextLine text={line} />
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
}

function TextLine({ text }: { text: string }) {
  // Check for greentext
  if (text.startsWith(">") && !text.startsWith(">>")) {
    return <span className="greentext">{text}</span>;
  }

  // Parse for quotes and spoilers
  const parts = [];
  let lastIndex = 0;

  // Regex for >>123 and [spoiler]...[/spoiler]
  const regex = />>(\d+)|\[spoiler\](.*?)\[\/spoiler\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // It's a quote >>(\d+)
      const postNumber = parseInt(match[1]);
      parts.push(<PostQuote key={match.index} postNumber={postNumber} />);
    } else if (match[2]) {
      // It's a spoiler
      parts.push(
        <span key={match.index} className="spoiler">
          {match[2]}
        </span>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}

function PostQuote({ postNumber }: { postNumber: number }) {
  const [post, setPost] = useState<PostInfoEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open && !post && !isLoading && !hasError) {
      setIsLoading(true);
      getPostByNumber(postNumber)
        .then((data) => {
          if (data) {
            setPost(data);
          } else {
            setHasError(true);
          }
        })
        .catch(() => setHasError(true))
        .finally(() => setIsLoading(false));
    }
  };

  const href = post
    ? `/${post.boardCode}/thread/${post.threadId}#p${post.postNumber}`
    : "#";

  const handleClick = (e: React.MouseEvent) => {
    // If we are already on the same thread, do a smooth scroll + highlight
    const targetElement = document.getElementById(`p${postNumber}`);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Traditional imageboard highlight effect
      targetElement.classList.add("ring-4", "ring-accent/50", "transition-all");
      setTimeout(() => {
        targetElement.classList.remove("ring-4", "ring-accent/50");
      }, 2000);
    }
  };

  return (
    <HoverCard openDelay={200} closeDelay={100} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <Link href={href} className="quote-link" onClick={handleClick}>
          &gt;&gt;{postNumber}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden border-accent/20 bg-card shadow-xl">
        {isLoading ? (
          <div className="p-4 text-xs text-muted-foreground animate-pulse">
            Memuat post...
          </div>
        ) : hasError ? (
          <div className="p-4 text-xs text-destructive">
            Post tidak ditemukan
          </div>
        ) : post ? (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono border-b pb-1">
              <span className="font-bold text-accent">#{post.postNumber}</span>
              <span className="text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              {post.image && (
                <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate mb-1">{post.author}</p>
                <p className="text-[11px] line-clamp-4 leading-relaxed opacity-90">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
