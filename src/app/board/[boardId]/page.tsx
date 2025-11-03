import { MainHeader } from "@/components/layout/main-header";
import { BoardHeader } from "@/components/board/board-header";
import { ThreadGrid } from "@/components/board/thread-grid";
import { boards, threads } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import { getAllBoardsAction } from "@/app/board.action";
import { getThreadsByBoardAction } from "@/app/thread.action";

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

  const boardThreads = await getThreadsByBoardAction(params.boardId);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader boards={boards} />
      <main>
        <BoardHeader board={board} />
        <div className="container mx-auto px-4 py-6">
          <ThreadGrid threads={boardThreads} />
        </div>
      </main>
    </div>
  );
}
