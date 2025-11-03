// src/lib/application/use-cases/board/get-by-id.use-case.ts

import { IBoardRepository } from "../../repositories/board.repository.interface";

export class GetAllBoardsByIdUseCase {
  constructor(private boardRepository: IBoardRepository) {}

  async execute(id: string) {
    return this.boardRepository.getById(id);
  }
}
