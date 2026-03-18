import type { BoardRepository } from "@/lib/repositories/board.repository"
import type { BoardEntity } from "@/lib/entities/board.entity"

export class GetBoardByIdUseCase {
  constructor(private boardRepository: BoardRepository) { }

  async execute(id: number): Promise<BoardEntity | null> {
    return await this.boardRepository.findById(id)
  }
}
