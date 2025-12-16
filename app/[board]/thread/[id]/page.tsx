import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Pin } from "lucide-react"
import { ReplyForm } from "@/components/reply-form"
import { ReportButton } from "@/components/report-button"
import { BoardRepository } from "@/lib/repositories/board.repository"
import { ThreadRepository } from "@/lib/repositories/thread.repository"
import { ReplyRepository } from "@/lib/repositories/reply.repository"
import { GetThreadDetailUseCase } from "@/lib/use-cases/get-thread-detail.use-case"

export default async function ThreadPage({ params }: { params: Promise<{ board: string; id: string }> }) {
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
        <Card className="mb-6 border-accent">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle>
                  {thread.subject || "Tanpa Subjek"}{" "}
                  <span className="text-muted-foreground font-normal">#{thread.id}</span>
                </CardTitle>
                <CardDescription>
                  oleh {thread.author} • {thread.createdAt.toLocaleString()}
                </CardDescription>
              </div>
              <ReportButton contentType="thread" contentId={thread.id} />
            </div>
          </CardHeader>
          <CardContent>
            {thread.image && (
              <div className="mb-4">
                <img src={thread.image || "/placeholder.svg"} alt="Gambar thread" className="max-w-md rounded border" />
              </div>
            )}
            <p className="whitespace-pre-wrap text-balance">{thread.content}</p>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          {replies?.map((reply) => (
            <Card key={reply.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardDescription className="flex-1">
                    <span className="font-medium text-foreground">{reply.author}</span> •{" "}
                    {reply.createdAt.toLocaleString()} • #{reply.id}
                  </CardDescription>
                  <ReportButton contentType="reply" contentId={reply.id} />
                </div>
              </CardHeader>
              <CardContent>
                {reply.image && (
                  <div className="mb-4">
                    <img
                      src={reply.image || "/placeholder.svg"}
                      alt="Gambar balasan"
                      className="max-w-md rounded border"
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap text-balance">{reply.content}</p>
              </CardContent>
            </Card>
          ))}

          {replies?.length === 0 && (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                <p>Belum ada balasan. Jadilah yang pertama membalas!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {!thread.isLocked && <ReplyForm threadId={thread.id} boardCode={boardCode} />}

        {thread.isLocked && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p>Thread ini terkunci. Tidak ada balasan baru yang bisa diposting.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
