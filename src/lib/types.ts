export interface Board {
  id: string
  name: string
  description?: string | null 
  threadCount: number
}

export interface Thread {
  id: string
  boardId: string
  title: string
  content: string
  image?: string
  author: string
  createdAt: Date
  replyCount: number
  lastReply?: Date
  isPinned?: boolean
}

export interface ReplyType {
  id: string
  threadId: string
  content: string
  image?: string
  author: string
  createdAt: Date
  replyTo?: string
}

export interface User {
  id: string
  name: string
  avatar?: string
  isAnonymous: boolean
}

export type Reply = ReplyType
