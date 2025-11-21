import { MainHeader } from "@/components/layout/main-header";
import { BoardClient } from "@/components/board/board-client";
import { notFound } from "next/navigation";
import { getAllBoardsAction } from "@/app/board.action";
import { getThreadsByBoardAction } from "@/app/thread.action";
import { Footer } from "@/components/layout/footer";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const boards = await getAllBoardsAction();
  const board = boards.find((b) => b.id === params.boardId);

  if (!board) {
    notFound();
  }

  const threads = await getThreadsByBoardAction(params.boardId);

  return (
    <>
      <MainHeader boards={boards} />
      <main>
        <BoardClient board={board} initialThreads={threads} />
      </main>
      <Footer />
    </>
  );
}
