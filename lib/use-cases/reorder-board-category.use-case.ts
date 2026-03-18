import type { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"

export class ReorderBoardCategoryUseCase {
  constructor(private categoryRepository: BoardCategoryRepository) { }

  async execute(id: number, direction: 'up' | 'down'): Promise<void> {
    const categories = await this.categoryRepository.findAll()
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) throw new Error("Category not found")
    
    if (direction === 'up' && index > 0) {
        // Tukar di dalam memory
        const temp = categories[index]
        categories[index] = categories[index - 1]
        categories[index - 1] = temp
    } else if (direction === 'down' && index < categories.length - 1) {
        // Tukar di dalam memory
        const temp = categories[index]
        categories[index] = categories[index + 1]
        categories[index + 1] = temp
    } else {
        return; // Tidak ada yang berubah
    }

    // Terapkan indeks array yang baru secara menyeluruh (mencegah bug urutan kembar dan tabrakan identitas)
    const orderedIds = categories.map(c => c.id)
    await this.categoryRepository.updateAllOrders(orderedIds)
  }
}
