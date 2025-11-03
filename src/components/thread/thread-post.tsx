"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Clock, Reply } from "lucide-react";
import type { Thread } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ModerationModal } from "@/components/modals/moderation-modal";

interface ThreadPostProps {
  thread: Thread;
}

export function ThreadPost({ thread }: ThreadPostProps) {
  return (
    <Card id={`reply-${thread.id}`} className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{thread.author}</span>
                {thread.isPinned && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                <span>•</span>
                <span>No. {thread.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {

                window.dispatchEvent(
                  new CustomEvent("prefill-reply", {
                    detail: {
                      text: `>> ${thread.id.slice(0, 8)}\n`,
                      replyTo: thread.id
                    },
                  })
                );

                const el = document.getElementById(
                  "reply-textarea"
                ) as HTMLTextAreaElement | null;
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.focus();
                }
              }}
            >
              <Reply className="w-4 h-4" />
            </Button>

            <ModerationModal type="report" postId={thread.id} />
            <ModerationModal type="delete" postId={thread.id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <h1 className="text-xl font-semibold">{thread.title}</h1>

        {thread.image && (
          <div className="relative max-w-md">
            <Image
              src={thread.image || "/placeholder.svg"}
              alt="Thread image"
              width={400}
              height={300}
              className="rounded-lg border"
            />
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{thread.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
