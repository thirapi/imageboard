import type { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"
import type { BoardCategoryEntity } from "@/lib/entities/board.entity"

export class CreateBoardCategoryUseCase {
  constructor(private categoryRepository: BoardCategoryRepository) { }

  async execute(data: { name: string; displayOrder?: number }): Promise<BoardCategoryEntity> {
    const categories = await this.categoryRepository.findAll()
    
    // Auto-assign displayOrder if not provided or to avoid collisions
    let displayOrder = data.displayOrder
    if (displayOrder === undefined || displayOrder === null) {
      const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.displayOrder), 0)
      displayOrder = maxOrder + 1
    }
    
    return await this.categoryRepository.create({ name: data.name, displayOrder })
  }
}
