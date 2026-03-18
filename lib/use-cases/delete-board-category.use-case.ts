import type { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"
import type { BoardRepository } from "@/lib/repositories/board.repository"

export class DeleteBoardCategoryUseCase {
  constructor(
    private categoryRepository: BoardCategoryRepository,
    private boardRepository: BoardRepository
  ) { }

  async execute(id: number): Promise<void> {
    // 1. Clear category associations in boards table first
    await this.boardRepository.clearCategoryForBoards(id)
    
    // 2. Delete the category safely
    return await this.categoryRepository.delete(id)
  }
}
