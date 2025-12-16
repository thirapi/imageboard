export interface ImageEntity {
  id: number
  url: string
  publicId: string
  threadId?: number
  replyId?: number
  createdAt: Date
}

export interface CreateImageInput {
  url: string
  publicId: string
  threadId?: number
  replyId?: number
}
