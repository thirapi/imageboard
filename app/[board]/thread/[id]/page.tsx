import { notFound } from "next/navigation";
import Link from "next/link";
import { BoardRepository } from "@/lib/repositories/board.repository";
import { ThreadRepository } from "@/lib/repositories/thread.repository";
import { ReplyRepository } from "@/lib/repositories/reply.repository";
import { GetThreadDetailUseCase } from "@/lib/use-cases/get-thread-detail.use-case";
import { ThreadClient } from "./thread";
import { footerText } from "@/constants/footer";

interface ThreadPageProps {
  params: Promise<{ board: string; id: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { board: boardCode, id } = await params;
  const threadId = Number.parseInt(id);

  const threadRepository = new ThreadRepository();
  const replyRepository = new ReplyRepository();
  const getThreadDetailUseCase = new GetThreadDetailUseCase(
    threadRepository,
    replyRepository,
  );

  const result = await getThreadDetailUseCase.execute(threadId);

  if (!result) {
    notFound();
  }

  const { thread, replies } = result;

  const boardRepository = new BoardRepository();
  const board = await boardRepository.findById(thread.boardId);

  if (!board || board.code !== boardCode) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-2 px-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${boardCode}`}
            className="text-accent hover:underline font-bold"
          >
            [ Kembali ke /{boardCode}/ ]
          </Link>
        </div>
        <div className="text-xl font-bold text-accent">
          /{board.code}/ - {board.name}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ThreadClient
          thread={thread}
          replies={replies || []}
          boardCode={boardCode}
        />
      </main>

      <footer className="mt-20 border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground whitespace-pre-wrap">
          [{" "}
          <Link href="/" className="hover:underline text-accent mx-1">
            Home
          </Link>{" "}
          ] [{" "}
          <Link
            href={`/${boardCode}`}
            className="hover:underline text-accent mx-1"
          >
            /{boardCode}/
          </Link>{" "}
          ]{footerText}
        </div>
      </footer>
    </div>
  );
}
