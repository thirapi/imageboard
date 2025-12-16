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
}
