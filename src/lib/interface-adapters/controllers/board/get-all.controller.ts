import { BoardModule } from "@/lib/modules/board.module";

const boardModule = new BoardModule();

export const getAllBoardsController = async () => {
  return boardModule.getAllBoardsUseCase.execute();
};
