export interface ReplyEntity {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  isNsfw: boolean
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  postNumber: number
  ipAddress?: string | null
}

export interface CreateReplyCommand {
  threadId: number
  content: string
  author?: string
  imageFile?: File | null
  deletionPassword?: string
  isNsfw?: boolean
  ipAddress?: string
}

export interface CreateReplyInput {
  threadId: number
  content: string
  author?: string
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  isNsfw?: boolean
  postNumber: number
  ipAddress?: string
}

export interface ReplyUI {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  isNsfw: boolean
  image?: string | null
  imageMetadata?: string | null
  postNumber: number
  ipAddress?: string | null
}