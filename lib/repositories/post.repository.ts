import { db } from "@/lib/db"
import { threads, replies, boards } from "@/lib/db/schema"
import { desc, eq, isNotNull, and, sql, count, gt } from "drizzle-orm"
import type { LatestPostEntity, RecentImageEntity, PostInfoEntity } from "@/lib/entities/post.entity"
import type { SystemStatsEntity } from "@/lib/entities/stats.entity"

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
      .where(
        and(
          eq(replies.isDeleted, false),
          eq(threads.isDeleted, false)
        )
      )
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
          eq(threads.isDeleted, false),
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

  async findByPostNumber(postNumber: number): Promise<PostInfoEntity | null> {
    // Check threads first
    const thread = await db
      .select({
        id: threads.id,
        postNumber: threads.postNumber,
        content: threads.content,
        author: threads.author,
        createdAt: threads.createdAt,
        image: threads.image,
        boardCode: boards.code,
      })
      .from(threads)
      .innerJoin(boards, eq(threads.boardId, boards.id))
      .where(
        and(
          eq(threads.postNumber, postNumber),
          eq(threads.isDeleted, false),
        )
      )
      .limit(1)

    if (thread.length > 0) {
      return {
        id: thread[0].id,
        postNumber: thread[0].postNumber as number,
        content: thread[0].content,
        author: thread[0].author!,
        createdAt: thread[0].createdAt!,
        image: thread[0].image,
        boardCode: thread[0].boardCode,
        type: "thread",
        threadId: thread[0].id,
      }
    }

    // Check replies
    const reply = await db
      .select({
        id: replies.id,
        postNumber: replies.postNumber,
        content: replies.content,
        author: replies.author,
        createdAt: replies.createdAt,
        image: replies.image,
        threadId: replies.threadId,
        boardCode: boards.code,
      })
      .from(replies)
      .innerJoin(threads, eq(replies.threadId, threads.id))
      .innerJoin(boards, eq(threads.boardId, boards.id))
      .where(
        and(
          eq(replies.postNumber, postNumber),
          eq(replies.isDeleted, false),
          eq(threads.isDeleted, false),
        )
      )
      .limit(1)

    if (reply.length > 0) {
      return {
        id: reply[0].id,
        postNumber: reply[0].postNumber as number,
        content: reply[0].content,
        author: reply[0].author!,
        createdAt: reply[0].createdAt!,
        image: reply[0].image,
        threadId: reply[0].threadId,
        boardCode: reply[0].boardCode,
        type: "reply",
      }
    }

    return null
  }

  async getSystemStats(): Promise<SystemStatsEntity> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [threadCount] = await db.select({ value: count() }).from(threads).where(eq(threads.isDeleted, false))
    const [replyCount] = await db.select({ value: count() }).from(replies).where(eq(replies.isDeleted, false))

    const [threadsToday] = await db
      .select({ value: count() })
      .from(threads)
      .where(
        and(
          gt(threads.createdAt, twentyFourHoursAgo),
          eq(threads.isDeleted, false)
        )
      )

    const [repliesToday] = await db
      .select({ value: count() })
      .from(replies)
      .where(
        and(
          gt(replies.createdAt, twentyFourHoursAgo),
          eq(replies.isDeleted, false)
        )
      )

    const [threadImages] = await db
      .select({ value: count() })
      .from(threads)
      .where(
        and(
          isNotNull(threads.image),
          eq(threads.isDeleted, false)
        )
      )

    const [replyImages] = await db
      .select({ value: count() })
      .from(replies)
      .where(
        and(
          isNotNull(replies.image),
          eq(replies.isDeleted, false)
        )
      )

    // Active Threads: Unique thread IDs that had activity (created or replied to) in last 24h
    // Only count threads that are not deleted
    const tActive = await db
      .select({ id: threads.id })
      .from(threads)
      .where(
        and(
          gt(threads.createdAt, twentyFourHoursAgo),
          eq(threads.isDeleted, false)
        )
      )

    const rActive = await db
      .select({ threadId: replies.threadId })
      .from(replies)
      .innerJoin(threads, eq(replies.threadId, threads.id)) // Ensure parent thread not deleted too
      .where(
        and(
          gt(replies.createdAt, twentyFourHoursAgo),
          eq(replies.isDeleted, false),
          eq(threads.isDeleted, false)
        )
      )

    const activeThreadIds = new Set()
    tActive.forEach((t) => activeThreadIds.add(t.id))
    rActive.forEach((r) => activeThreadIds.add(r.threadId))

    return {
      totalPosts: Number(threadCount.value) + Number(replyCount.value),
      postsToday: Number(threadsToday.value) + Number(repliesToday.value),
      totalImages: Number(threadImages.value) + Number(replyImages.value),
      activeThreads24h: activeThreadIds.size,
    }
  }
}
