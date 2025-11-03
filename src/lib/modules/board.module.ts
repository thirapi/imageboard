// src/lib/modules/board.module.ts
import { BoardRepository } from "../infrastructure/repositories/board.repository";
import { GetAllBoardsUseCase } from "../application/use-cases/board/get-all.use-case";
import { GetAllBoardsByIdUseCase } from "../application/use-cases/board/get-by-id.use-case";

export class BoardModule {
  private boardRepository: BoardRepository;

  public getAllBoardsUseCase: GetAllBoardsUseCase;
  public getBoardByIdUseCase: GetAllBoardsByIdUseCase;

  constructor() {
    this.boardRepository = new BoardRepository();

    this.getAllBoardsUseCase = new GetAllBoardsUseCase(this.boardRepository);
    this.getBoardByIdUseCase = new GetAllBoardsByIdUseCase(this.boardRepository);
  }
}
