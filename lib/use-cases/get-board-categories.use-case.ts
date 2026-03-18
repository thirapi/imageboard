import type { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"
import type { BoardCategoryEntity } from "@/lib/entities/board.entity"

export class GetBoardCategoriesUseCase {
  constructor(private categoryRepository: BoardCategoryRepository) { }

  async execute(): Promise<BoardCategoryEntity[]> {
    return await this.categoryRepository.findAll()
  }
}
