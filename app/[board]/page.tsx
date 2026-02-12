import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pin, Lock, MessageSquare } from "lucide-react";
import { ThreadForm } from "@/components/thread-form";
import { FormattedText } from "@/components/formatted-text";
import { BoardRepository } from "@/lib/repositories/board.repository";
import { ThreadRepository } from "@/lib/repositories/thread.repository";
import { ReplyRepository } from "@/lib/repositories/reply.repository";
import { GetThreadListUseCase } from "@/lib/use-cases/get-thread-list.use-case";
import { BoardViewToggle } from "@/components/board-view-toggle";
import { BoardSearch } from "@/components/board-search";
import { CatalogView } from "@/components/catalog-view";
import { cn } from "@/lib/utils";
import { footerText } from "@/constants/footer";
import { FormattedDate } from "@/components/formatted-date";

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ board: string }>;
  searchParams: Promise<{ view?: string; q?: string }>;
}) {
  const { board: boardCode } = await params;
  const { view = "list", q: query = "" } = await searchParams;

  const boardRepository = new BoardRepository();
  const board = await boardRepository.findByCode(boardCode);

  if (!board) {
    notFound();
  }

  const threadRepository = new ThreadRepository();
  const replyRepository = new ReplyRepository();
  const getThreadListUseCase = new GetThreadListUseCase(
    threadRepository,
    replyRepository,
  );
  let threads = await getThreadListUseCase.execute(board.id);

  if (query) {
    const q = query.toLowerCase();
    threads = threads.filter(
      (t) =>
        t.subject?.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q),
    );
  }

  const isCatalog = view === "catalog";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 text-center border-b mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-accent mb-1 tracking-tight">
          /{board.code}/ - {board.name}
        </h1>
        <p className="text-sm text-muted-foreground italic mb-4 max-w-xl">
          {board.description}
        </p>

        <div className="flex items-center gap-4">
          <BoardSearch />
          <BoardViewToggle />
        </div>
      </header>

      <main
        className={cn(
          "mx-auto pb-20 flex-1 w-full",
          isCatalog
            ? "px-6 md:px-12 lg:px-20 max-w-none"
            : "px-4 md:px-8 max-w-6xl",
        )}
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-full max-w-2xl">
            <ThreadForm boardId={board.id} boardCode={board.code} />
          </div>
        </div>

        <div className="border-t pt-8">
          {isCatalog ? (
            <CatalogView threads={threads || []} boardCode={boardCode} />
          ) : (
            <div className="divide-y divide-muted/30">
              {threads?.map((thread) => (
                <div key={thread.id} className="ib-post py-8 first:pt-0">
                  {/* Meta line */}
                  <div className="ib-post-metaline">
                    {thread.isPinned && (
                      <Pin className="h-3 w-3 text-accent fill-accent" />
                    )}
                    {thread.isLocked && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    {thread.subject && (
                      <span className="ib-subject">{thread.subject}</span>
                    )}
                    <span className="ib-author">
                      {thread.author || "Anonymous"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      <FormattedDate date={thread.createdAt} />
                    </span>
                    <Link
                      href={`/${boardCode}/thread/${thread.id}`}
                      className="ib-post-number"
                    >
                      No.{thread.postNumber}
                    </Link>
                    <Link
                      href={`/${boardCode}/thread/${thread.id}`}
                      className="text-[11px] hover:underline flex items-center gap-1 text-muted-foreground ml-2"
                    >
                      [Balas]
                    </Link>
                  </div>

                  {/* Content area with side-by-side layout for OP */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    {thread.image && (
                      <div className="shrink-0">
                        <Link href={`/${boardCode}/thread/${thread.id}`}>
                          <img
                            src={thread.image}
                            alt="Thumbnail"
                            className="max-w-[200px] max-h-[200px] object-contain border rounded-sm hover:opacity-90 transition-opacity"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words max-w-4xl">
                        <FormattedText content={thread.content} />
                      </div>

                      {thread.replyCount > (thread.replies?.length || 0) && (
                        <div className="mt-4 text-xs text-muted-foreground italic">
                          {thread.replyCount - (thread.replies?.length || 0)}{" "}
                          balasan diabaikan.
                          <Link
                            href={`/${boardCode}/thread/${thread.id}`}
                            className="text-accent hover:underline ml-1"
                          >
                            Klik di sini untuk melihat semua.
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Previews */}
                  {thread.replies && thread.replies.length > 0 && (
                    <div className="mt-4 space-y-3 ml-4 sm:ml-12 max-w-5xl">
                      {thread.replies
                        .slice()
                        .reverse()
                        .slice(0, 3)
                        .reverse()
                        .map((reply) => (
                          <div
                            key={reply.id}
                            className="ib-reply shadow-sm border border-muted/20"
                          >
                            <div className="ib-post-metaline text-xs px-2 pt-1">
                              <span className="ib-author">
                                {reply.author || "Anonymous"}
                              </span>
                              <span className="text-muted-foreground opacity-70">
                                <FormattedDate date={reply.createdAt} />
                              </span>
                              <span className="ib-post-number opacity-80">
                                No.{reply.postNumber}
                              </span>
                            </div>
                            <div className="flex gap-3 p-2">
                              {reply.image && (
                                <div className="shrink-0">
                                  <img
                                    src={reply.image}
                                    alt="Reply thumbnail"
                                    className="max-w-[80px] max-h-[80px] object-cover border rounded-xs"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <div className="text-sm leading-snug flex-1 overflow-hidden">
                                <FormattedText content={reply.content} />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}

              {threads?.length === 0 && (
                <div className="py-20 text-center text-muted-foreground italic">
                  {query
                    ? `Tidak ada thread yang cocok dengan pencarian "${query}".`
                    : "Belum ada thread. Jadilah yang pertama memulai diskusi!"}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>{footerText}</p>
        </div>
      </footer>
    </div>
  );
}
