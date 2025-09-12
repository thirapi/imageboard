import { MainHeader } from "@/components/layout/main-header"
import { ThreadPost } from "@/components/thread/thread-post"
import { ReplyList } from "@/components/thread/reply-list"
import { ReplyForm } from "@/components/thread/reply-form"
import { ThreadNavigation } from "@/components/thread/thread-navigation"
import { threads, replies, boards } from "@/lib/dummy-data"
import { notFound } from "next/navigation"

interface ThreadPageProps {
  params: {
    threadId: string
  }
}

export default function ThreadPage({ params }: ThreadPageProps) {
  const thread = threads.find((t) => t.id === params.threadId)

  if (!thread) {
    notFound()
  }

  const board = boards.find((b) => b.id === thread.boardId)
  const threadReplies = replies.filter((reply) => reply.threadId === params.threadId)

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main>
        <ThreadNavigation thread={thread} board={board} />
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          <ThreadPost thread={thread} />
          <ReplyList replies={threadReplies} />
          <ReplyForm threadId={thread.id} />
        </div>
      </main>
    </div>
  )
}
