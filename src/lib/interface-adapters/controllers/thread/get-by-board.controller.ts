import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const getThreadByBoardController = async (boardId: string) => {
  return threadModule.getThreadsByBoardUseCase.execute(boardId);
};
