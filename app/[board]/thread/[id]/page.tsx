// app/(boards)/[board]/[id]/page.tsx  (atau path sesuai strukturmu)
import { notFound } from "next/navigation"
import Link from "next/link"
import { BoardRepository } from "@/lib/repositories/board.repository"
import { ThreadRepository } from "@/lib/repositories/thread.repository"
import { ReplyRepository } from "@/lib/repositories/reply.repository"
import { GetThreadDetailUseCase } from "@/lib/use-cases/get-thread-detail.use-case"
import { ThreadClient } from "./thread"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Pin } from "lucide-react"

interface ThreadPageProps {
  params: Promise<{ board: string; id: string }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { board: boardCode, id } = await params
  const threadId = Number.parseInt(id)

  const threadRepository = new ThreadRepository()
  const replyRepository = new ReplyRepository()
  const getThreadDetailUseCase = new GetThreadDetailUseCase(threadRepository, replyRepository)

  const result = await getThreadDetailUseCase.execute(threadId)

  if (!result) {
    notFound()
  }

  const { thread, replies } = result

  const boardRepository = new BoardRepository()
  const board = await boardRepository.findById(thread.boardId)

  if (!board || board.code !== boardCode) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/${boardCode}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke /{boardCode}/
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-balance flex items-center gap-2 flex-wrap">
            {thread.isPinned && <Pin className="h-5 w-5 text-accent shrink-0" aria-label="Disematkan" />}
            {thread.isLocked && <Lock className="h-5 w-5 text-muted-foreground shrink-0" aria-label="Terkunci" />}
            {thread.subject || "Tanpa Subjek"}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">

        <ThreadClient 
          thread={thread} 
          replies={replies || []} 
          boardCode={boardCode} 
        />
      </main>
    </div>
  )
}