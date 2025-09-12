import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Clock, Pin } from "lucide-react"
import type { Thread } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ThreadCardProps {
  thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Link href={`/thread/${thread.id}`}>
      <Card className="h-full hover:bg-accent transition-colors cursor-pointer group">
        <CardContent className="p-4 space-y-3">
          {thread.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={thread.image || "/placeholder.svg"}
                alt="Thread image"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              {thread.isPinned && <Pin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />}
              <h3 className="font-medium text-sm line-clamp-2 leading-tight">{thread.title}</h3>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3">{thread.content}</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{thread.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{thread.author}</span>
          </div>

          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {thread.replyCount}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(thread.lastReply || thread.createdAt, { addSuffix: true })}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
