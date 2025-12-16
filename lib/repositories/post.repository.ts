import { db } from "@/lib/db"
import { threads, replies, boards } from "@/lib/db/schema"
import { desc, eq, isNotNull, and } from "drizzle-orm"
import type { LatestPostEntity, RecentImageEntity } from "@/lib/entities/post.entity"

export class PostRepository {
  async getLatestPosts(limit = 10): Promise<LatestPostEntity[]> {

    const latestThreads = await db
      .select({
        id: threads.id,
        subject: threads.subject,
        content: threads.content,
        createdAt: threads.createdAt,
        boardCode: boards.code,
      })
      .from(threads)
      .innerJoin(boards, eq(threads.boardId, boards.id))
      .where(eq(threads.isDeleted, false))
      .orderBy(desc(threads.createdAt))
      .limit(limit)

    const latestReplies = await db
      .select({
        id: replies.id,
        content: replies.content,
        createdAt: replies.createdAt,
        threadId: replies.threadId,
        boardCode: boards.code,
      })
      .from(replies)
      .innerJoin(threads, eq(replies.threadId, threads.id))
      .innerJoin(boards, eq(threads.boardId, boards.id))
      .where(eq(replies.isDeleted, false))
      .orderBy(desc(replies.createdAt))
      .limit(limit)

    const posts: LatestPostEntity[] = []

    for (const t of latestThreads) {
      posts.push({
        id: t.id,
        type: "thread",
        title: t.subject,
        excerpt: t.content.substring(0, 200),
        createdAt: t.createdAt!,
        boardCode: t.boardCode,
        threadId: t.id,
      })
    }

    for (const r of latestReplies) {
      posts.push({
        id: r.id,
        type: "reply",
        title: null,
        excerpt: r.content.substring(0, 200),
        createdAt: r.createdAt!,
        boardCode: r.boardCode,
        threadId: r.threadId,
      })
    }

    return posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

async getRecentImages(limit = 12): Promise<RecentImageEntity[]> {
  const threadImages = await db
    .select({
      id: threads.id,
      imageUrl: threads.image,
      createdAt: threads.createdAt,
      boardCode: boards.code,
      threadId: threads.id,
    })
    .from(threads)
    .innerJoin(boards, eq(threads.boardId, boards.id))
    .where(
      and(
        eq(threads.isDeleted, false),
        isNotNull(threads.image),
      )
    )
    .orderBy(desc(threads.createdAt))
    .limit(limit)

  const replyImages = await db
    .select({
      id: replies.id,
      imageUrl: replies.image,
      createdAt: replies.createdAt,
      boardCode: boards.code,
      threadId: replies.threadId,
    })
    .from(replies)
    .innerJoin(threads, eq(replies.threadId, threads.id))
    .innerJoin(boards, eq(threads.boardId, boards.id))
    .where(
      and(
        eq(replies.isDeleted, false),
        isNotNull(replies.image),
      )
    )
    .orderBy(desc(replies.createdAt))
    .limit(limit)

  const images: RecentImageEntity[] = []

  for (const t of threadImages) {
    images.push({
      id: t.id,
      imageUrl: t.imageUrl!,
      createdAt: t.createdAt!,
      boardCode: t.boardCode,
      threadId: t.threadId,
    })
  }

  for (const r of replyImages) {
    images.push({
      id: r.id,
      imageUrl: r.imageUrl!,
      createdAt: r.createdAt!,
      boardCode: r.boardCode,
      threadId: r.threadId,
    })
  }

  return images
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

}
