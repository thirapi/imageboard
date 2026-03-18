import type { CreateBoardCategoryUseCase } from "@/lib/use-cases/create-board-category.use-case"
import type { UpdateBoardCategoryUseCase } from "@/lib/use-cases/update-board-category.use-case"
import type { DeleteBoardCategoryUseCase } from "@/lib/use-cases/delete-board-category.use-case"
import type { GetBoardCategoriesUseCase } from "@/lib/use-cases/get-board-categories.use-case"
import type { ReorderBoardCategoryUseCase } from "@/lib/use-cases/reorder-board-category.use-case"

export interface CreateCategoryRequest {
  name: string
  displayOrder?: number
}

export interface UpdateCategoryRequest {
  id: number
  name?: string
  displayOrder?: number
}

export class BoardCategoryController {
  constructor(
    private createCategoryUseCase: CreateBoardCategoryUseCase,
    private updateCategoryUseCase: UpdateBoardCategoryUseCase,
    private deleteCategoryUseCase: DeleteBoardCategoryUseCase,
    private getCategoriesUseCase: GetBoardCategoriesUseCase,
    private reorderCategoryUseCase: ReorderBoardCategoryUseCase,
  ) { }

  async getCategories() {
    return await this.getCategoriesUseCase.execute()
  }

  async createCategory(request: CreateCategoryRequest) {
    if (!request.name) throw new Error("Category name is required")
    
    return await this.createCategoryUseCase.execute({
      name: request.name,
      displayOrder: request.displayOrder ?? 0,
    })
  }

  async updateCategory(request: UpdateCategoryRequest) {
    if (!request.id) throw new Error("Category ID is required")
    
    return await this.updateCategoryUseCase.execute(request.id, {
      name: request.name,
      displayOrder: request.displayOrder,
    })
  }

  async deleteCategory(id: number) {
    if (!id) throw new Error("Category ID is required")
    await this.deleteCategoryUseCase.execute(id)
    return { success: true }
  }

  async reorderCategory(id: number, direction: 'up' | 'down') {
    if (!id) throw new Error("Category ID is required")
    await this.reorderCategoryUseCase.execute(id, direction)
    return { success: true }
  }
}
