import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Clock, Pin } from "lucide-react"
import type { Thread } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ThreadListItemProps {
  thread: Thread
}

export function ThreadListItem({ thread }: ThreadListItemProps) {
  return (
    <Link href={`/thread/${thread.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {thread.image && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image src={thread.image || "/placeholder.svg"} alt="Thread image" fill className="object-cover" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start gap-2">
                {thread.isPinned && <Pin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />}
                <h3 className="font-medium text-sm line-clamp-1">{thread.title}</h3>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{thread.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs">{thread.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{thread.author}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {thread.replyCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(thread.lastReply || thread.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
