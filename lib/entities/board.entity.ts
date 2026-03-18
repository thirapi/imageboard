export interface BoardCategoryEntity {
  id: number
  name: string
  displayOrder: number
}

export interface BoardEntity {
  id: number
  code: string
  name: string
  description: string | null
  categoryId: number | null
  categoryName?: string | null
}

export interface CreateBoardCommand {
  code: string
  name: string
  description: string | null
  categoryId: number | null
}

export interface UpdateBoardCommand {
  id: number
  code?: string
  name?: string
  description?: string | null
  categoryId?: number | null
}
