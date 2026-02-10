export interface ReplyEntity {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  postNumber: number
}

export interface CreateReplyCommand {
  threadId: number
  content: string
  author?: string
  imageFile?: File | null
  deletionPassword?: string
}

export interface CreateReplyInput {
  threadId: number
  content: string
  author?: string
  image?: string | null
  imageMetadata?: string | null
  deletionPassword?: string | null
  postNumber: number
}

export interface ReplyUI {
  id: number
  threadId: number
  content: string
  author: string
  createdAt: Date
  isDeleted: boolean
  image?: string | null
  imageMetadata?: string | null
  postNumber: number
}