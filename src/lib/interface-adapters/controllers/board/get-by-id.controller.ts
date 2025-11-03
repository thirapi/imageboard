import { BoardModule } from "@/lib/modules/board.module";

const boardModule = new BoardModule();

export const getBoardByIdController = async (id: string) => {
    return boardModule.getBoardByIdUseCase.execute(id);
};
