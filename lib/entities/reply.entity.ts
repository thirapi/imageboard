export interface ReplyEntity {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  image?: string
  postNumber: number
}

export interface CreateReplyCommand {
  threadId: number
  content: string
  author?: string
  imageFile?: File | null
}

export interface CreateReplyInput {
  threadId: number
  content: string
  author?: string
  image?: string | null
  postNumber: number
}

export interface ReplyUI {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  image?: string
  postNumber: number
}