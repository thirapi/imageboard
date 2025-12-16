export interface ThreadEntity {
  id: number
  boardId: number
  subject: string | null
  content: string
  author: string
  createdAt: Date
  isPinned: boolean
  isLocked: boolean
  isDeleted: boolean
  bumpedAt: Date
  image?: string | null
}

export interface CreateThreadCommand {
  boardId: number
  subject?: string
  content: string
  author?: string
  imageFile?: File | null
}

export interface CreateThreadInput {
  boardId: number
  subject?: string
  content: string
  author?: string
  image?: string | null
}
