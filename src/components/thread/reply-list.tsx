import { ReplyPost } from "./reply-post"
import type { Reply } from "@/lib/types"

interface ReplyListProps {
  replies: Reply[]
}

export function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No replies yet. Be the first to reply!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Replies ({replies.length})</h2>
      <div className="space-y-3">
        {replies.map((reply) => (
          <ReplyPost key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  )
}
