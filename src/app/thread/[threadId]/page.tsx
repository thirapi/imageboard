import { MainHeader } from "@/components/layout/main-header";
import { ThreadPost } from "@/components/thread/thread-post";
import { ReplyList } from "@/components/thread/reply-list";
import { ReplyForm } from "@/components/thread/reply-form";
import { ThreadNavigation } from "@/components/thread/thread-navigation";
import { notFound } from "next/navigation";
import { getThreadByIdAction } from "@/app/thread.action";
import { getRepliesByThreadAction } from "@/app/reply.action";
import { getAllBoardsAction } from "@/app/board.action";
import { Footer } from "@/components/layout/footer";

interface ThreadPageProps {
  params: {
    threadId: string;
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const boards = await getAllBoardsAction();

  const thread = await getThreadByIdAction(params.threadId);

  if (!thread) {
    notFound();
  }

  const board = boards.find((b) => b.id === thread.boardId);
  const threadReplies = await getRepliesByThreadAction(thread.id);

  return (
    <>
      <MainHeader boards={boards} currentBoard={board} />
      <main>
        <ThreadNavigation thread={thread} board={board} />
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          <ThreadPost thread={thread} />
          <ReplyList replies={threadReplies} />
          <ReplyForm threadId={thread.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
