import { IBoardRepository } from "../../repositories/board.repository.interface";

export class GetAllBoardsUseCase {
  constructor(private boardRepository: IBoardRepository) {}

  async execute() {
    return this.boardRepository.getAll();
  }
}
