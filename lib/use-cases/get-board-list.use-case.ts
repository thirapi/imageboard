import type { BoardRepository } from "@/lib/repositories/board.repository";
import type { BoardEntity } from "@/lib/entities/board.entity";

export class GetBoardListUseCase {
  constructor(private boardRepository: BoardRepository) {}

  async execute(): Promise<BoardEntity[]> {
    const boards = await this.boardRepository.findAll();
    return boards;
  }
}
