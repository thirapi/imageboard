import { db } from "@/lib/db"
import { replies } from "@/lib/db/schema"
import { asc, eq, and, sql, desc } from "drizzle-orm"
import type { ReplyEntity, CreateReplyInput } from "@/lib/entities/reply.entity"

export class ReplyRepository {
  async create(input: CreateReplyInput): Promise<ReplyEntity> {

    const rows = await db
      .insert(replies)
      .values({
        threadId: input.threadId,
        content: input.content,
        author: input.author ?? "Awanama",
        image: input.image ?? null,
        postNumber: input.postNumber,
      })
      .returning()

    if (rows.length === 0) {
      throw new Error("Failed to create reply")
    }

    return this.mapToEntity(rows[0])
  }

  async findByThreadId(threadId: number): Promise<ReplyEntity[]> {
    const rows = await db
      .select()
      .from(replies)
      .where(
        and(
          eq(replies.threadId, threadId),
          eq(replies.isDeleted, false),
        )
      )
      .orderBy(asc(replies.createdAt))

    return rows.map((row) => this.mapToEntity(row))
  }

  async countByThreadId(threadId: number): Promise<number> {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(replies)
      .where(
        and(
          eq(replies.threadId, threadId),
          eq(replies.isDeleted, false),
        )
      )

    return result[0]?.count ?? 0
  }

  async softDelete(id: number): Promise<void> {
    await db
      .update(replies)
      .set({ isDeleted: true })
      .where(eq(replies.id, id))
  }

  async findById(id: number): Promise<ReplyEntity | null> {
    const rows = await db
      .select()
      .from(replies)
      .where(eq(replies.id, id))
      .limit(1)

    if (rows.length === 0) {
      return null
    }

    return this.mapToEntity(rows[0])
  }

  private mapToEntity(row: typeof replies.$inferSelect): ReplyEntity {
    return {
      id: row.id,
      threadId: row.threadId,
      content: row.content,
      author: row.author ?? "Awanama",
      createdAt: row.createdAt!,
      isDeleted: row.isDeleted ?? false,
      image: row.image ?? undefined,
      postNumber: row.postNumber!,
    }
  }

  async findPreviewByThreadId(threadId: number, limit: number = 3): Promise<ReplyEntity[]> {
    const rows = await db
      .select()
      .from(replies)
      .where(
        and(
          eq(replies.threadId, threadId),
          eq(replies.isDeleted, false)
        )
      )
      .orderBy(desc(replies.createdAt))
      .limit(limit)

    return rows.map((row) => this.mapToEntity(row))
  }

}
