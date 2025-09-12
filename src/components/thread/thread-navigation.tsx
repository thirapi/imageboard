import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, MessageSquare } from "lucide-react"
import type { Thread, Board } from "@/lib/types"

interface ThreadNavigationProps {
  thread: Thread
  board?: Board
}

export function ThreadNavigation({ thread, board }: ThreadNavigationProps) {
  return (
    <div className="border-b bg-card">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={board ? `/board/${board.id}` : "/"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {board?.name || "Boards"}
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">/</span>
            {board && (
              <>
                <Link href={`/board/${board.id}`} className="text-sm hover:underline">
                  {board.name}
                </Link>
                <span className="text-sm text-muted-foreground">/</span>
              </>
            )}
            <span className="text-sm font-medium">Thread #{thread.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            {thread.replyCount} replies
          </Badge>
        </div>
      </div>
    </div>
  )
}
