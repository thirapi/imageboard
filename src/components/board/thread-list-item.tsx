import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pin, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Thread } from "@/lib/types";

interface ThreadListItemProps {
  thread: Thread;
}

export function ThreadListItem({ thread }: ThreadListItemProps) {
  return (
    <Link
      href={`/thread/${thread.id}`}
      className="group block hover:bg-muted/50 transition-colors rounded-xl"
    >
      <Card className="flex items-start gap-4 p-4 border shadow-none bg-transparent">
        {/* Image Thumbnail */}
        {thread.image && (
          <div className="flex-shrink-0">
            <div className="relative w-24 h-16 sm:w-32 sm:h-20">
              <img
                src={thread.image}
                alt={thread.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            {thread.isPinned && <Pin className="w-4 h-4 text-muted-foreground" />}
            <p className="font-semibold text-base group-hover:underline leading-snug">
              {thread.title}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            by {thread.author}
          </p>

          {/* Stats */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.replyCount} Replies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                {thread.lastReply
                  ? formatDistanceToNow(new Date(thread.lastReply))
                  : "n/a"}{" "}
                ago
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}