"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, Quote } from "lucide-react";
import type { ReplyType } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ModerationModal } from "@/components/modals/moderation-modal";

interface ReplyPostProps {
  reply: ReplyType;
}

export function ReplyPost({ reply }: ReplyPostProps) {
  const [isQuoted, setIsQuoted] = useState(false);

  const handleQuote = () => {
    setIsQuoted(true);

    window.dispatchEvent(
      new CustomEvent("prefill-reply", {
        detail: {
          text: `>> ${reply.id.slice(0, 8)}\n`,
          replyTo: reply.id,
        },
      })
    );

    const el = document.getElementById("reply-textarea");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLTextAreaElement).focus();
    }
  };

  return (
    <Card
      id={`reply-${reply.id}`}
      className={cn(
        "ml-4",
        reply.replyTo && "ml-8 border-l-4 border-l-primary/50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs">
                {reply.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{reply.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                <span>•</span>
                <span>No. {reply.id.slice(0, 8)}</span>
                {reply.replyTo && (
                  <span
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => {
                      const el = document.getElementById(
                        `reply-${reply.replyTo}`
                      );
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        el.classList.add("ring-2", "ring-primary");
                        setTimeout(
                          () => el.classList.remove("ring-2", "ring-primary"),
                          1500
                        );
                      }
                    }}
                  >
                    &gt;&gt;{reply.replyTo.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleQuote}>
              <Quote className="w-4 h-4" />
            </Button>
            <ModerationModal type="report" postId={reply.id} />
            <ModerationModal type="delete" postId={reply.id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {reply.image && (
          <div className="relative max-w-sm">
            <Image
              src={reply.image || "/placeholder.svg"}
              alt="Reply image"
              width={300}
              height={200}
              className="rounded-lg border"
            />
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{reply.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
