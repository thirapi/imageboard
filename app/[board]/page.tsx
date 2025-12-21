import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pin, Lock } from "lucide-react"
import { ThreadForm } from "@/components/thread-form"
import { BoardRepository } from "@/lib/repositories/board.repository"
import { ThreadRepository } from "@/lib/repositories/thread.repository"
import { ReplyRepository } from "@/lib/repositories/reply.repository"
import { GetThreadListUseCase } from "@/lib/use-cases/get-thread-list.use-case"

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board: boardCode } = await params

  const boardRepository = new BoardRepository()
  const board = await boardRepository.findByCode(boardCode)

  if (!board) {
    notFound()
  }

  const threadRepository = new ThreadRepository()
  const replyRepository = new ReplyRepository()
  const getThreadListUseCase = new GetThreadListUseCase(threadRepository, replyRepository)
  const threads = await getThreadListUseCase.execute(board.id)

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Papan
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-balance">
            <span className="text-accent font-mono">/{board.code}/</span> - {board.name}
          </h1>
          <p className="text-sm text-muted-foreground">{board.description}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <ThreadForm boardId={board.id} boardCode={board.code} />
        </div>

        <div className="space-y-4">
          {threads?.map((thread) => (
            <Link key={thread.id} href={`/${boardCode}/thread/${thread.id}`}>
              <Card className="hover:border-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center gap-2 flex-wrap">
                        {thread.isPinned && <Pin className="h-4 w-4 text-accent shrink-0" aria-label="Disematkan" />}
                        {thread.isLocked && (
                          <Lock className="h-4 w-4 text-muted-foreground shrink-0" aria-label="Terkunci" />
                        )}
                        <span className="text-balance">{thread.subject || "Tanpa Subjek"}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        oleh {thread.author || "Anonymous"} • {thread.createdAt.toLocaleString()}
                        <span className="text-accent"> #{thread.postNumber} </span>
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {thread.replyCount} {thread.replyCount === 1 ? "balasan" : "balasan"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {thread.image && (
                    <div className="mb-4">
                      <img
                        src={thread.image || "/placeholder.svg"}
                        alt="Gambar thread"
                        className="max-w-xs rounded border"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Konten thread utama (OP) */}
                  <p className="text-sm line-clamp-3 text-balance mb-3">{thread.content}</p>

                  {/* Preview replies: 2-3 terbaru, style imageboard */}
                  {thread.replies && thread.replies.length > 0 && (
                    <div className="border-t pt-3 space-y-2 text-sm">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Balasan terbaru ({Math.min(3, thread.replies.length)}/{thread.replyCount})
                      </p>
                      {thread.replies.slice(0, 3).map((reply) => (
                        <div key={reply.id} className="pl-4 border-l-2 border-muted space-y-1 text-muted-foreground">
                          {/* Metadata: Timestamp + Post Number */}
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span>{reply.createdAt.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                            <span className="text-accent">#{reply.postNumber}</span>
                          </div>
                          {/* Konten + Thumbnail */}
                          <div className="flex items-start gap-2">
                            {reply.image && (
                              <img
                                src={reply.image}
                                alt="Preview balasan"
                                className="max-w-[60px] max-h-[60px] flex-shrink-0 border rounded-sm object-cover"
                                loading="lazy"
                              />
                            )}
                            <p className="line-clamp-2 flex-1 font-mono leading-relaxed">
                              <span className="text-accent">&gt;&gt; </span>{reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {threads?.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Belum ada thread. Jadilah yang pertama memulai diskusi!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}