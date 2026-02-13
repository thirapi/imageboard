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
  isNsfw: boolean
  bumpedAt: Date
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  postNumber: number
  ipAddress?: string | null
}

export interface CreateThreadCommand {
  boardId: number
  subject?: string
  content: string
  author?: string
  imageFile?: File | null
  deletionPassword?: string
  isNsfw?: boolean
  ipAddress?: string
}

export interface CreateThreadInput {
  boardId: number
  subject?: string
  content: string
  author?: string
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  isNsfw?: boolean
  postNumber: number
  ipAddress?: string
}

export interface ThreadUI {
  id: number
  boardId: number
  subject: string | null
  content: string
  author: string
  createdAt: Date
  isPinned: boolean
  isLocked: boolean
  isDeleted: boolean
  isNsfw: boolean
  bumpedAt: Date
  image?: string | null
  imageMetadata?: string | null
  postNumber: number
  ipAddress?: string | null
}