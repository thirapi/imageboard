export interface LatestPostEntity {
  id: number
  type: "thread" | "reply"
  title: string | null
  excerpt: string
  createdAt: Date
  boardCode: string
  threadId: number
}

export interface RecentImageEntity {
  id: number
  imageUrl: string
  createdAt: Date
  boardCode: string
  threadId: number
  isNsfw: boolean
  isSpoiler: boolean
}

export interface PostInfoEntity {
  id: number
  postNumber: number
  type: "thread" | "reply"
  content: string
  author: string
  createdAt: Date
  image?: string | null
  threadId: number
  boardCode: string
  isNsfw?: boolean
  isSpoiler?: boolean
}
