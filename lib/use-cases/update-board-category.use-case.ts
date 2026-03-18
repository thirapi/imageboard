import type { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"
import type { BoardCategoryEntity } from "@/lib/entities/board.entity"

export class UpdateBoardCategoryUseCase {
  constructor(private categoryRepository: BoardCategoryRepository) { }

  async execute(id: number, data: Partial<{ name: string; displayOrder: number }>): Promise<BoardCategoryEntity> {
    return await this.categoryRepository.update(id, data)
  }
}
