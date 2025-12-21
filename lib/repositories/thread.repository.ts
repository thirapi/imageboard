import { db } from "@/lib/db"
import { threads } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import type { ThreadEntity, CreateThreadInput } from "@/lib/entities/thread.entity"

export class ThreadRepository {
  async create(input: CreateThreadInput): Promise<ThreadEntity> {
    const [row] = await db
      .insert(threads)
      .values({
        boardId: input.boardId,
        subject: input.subject ?? null,
        content: input.content,
        author: input.author ?? "Awanama",
        image: input.image ?? null,
        postNumber: input.postNumber,
      })
      .returning()

    if (!row) throw new Error("Failed to create thread")

    return this.mapToEntity(row)
  }

  async findById(id: number): Promise<ThreadEntity | null> {
    const row = await db.query.threads.findFirst({
      where: eq(threads.id, id),
    })

    return row ? this.mapToEntity(row) : null
  }

  async findByBoardId(boardId: number): Promise<ThreadEntity[]> {
    const rows = await db.query.threads.findMany({
      where: and(
        eq(threads.boardId, boardId),
        eq(threads.isDeleted, false),
      ),
      orderBy: [
        desc(threads.isPinned),
        desc(threads.bumpedAt),
      ],
    })

    return rows.map((row) => this.mapToEntity(row))
  }

  async softDelete(id: number): Promise<void> {
    await db
      .update(threads)
      .set({ isDeleted: true })
      .where(eq(threads.id, id))
  }

  async updateBumpTime(id: number): Promise<void> {
    await db
      .update(threads)
      .set({ bumpedAt: new Date() })
      .where(eq(threads.id, id))
  }

  async updateLockStatus(id: number, isLocked: boolean): Promise<void> {
    await db
      .update(threads)
      .set({ isLocked })
      .where(eq(threads.id, id))
  }

  async updatePinStatus(id: number, isPinned: boolean): Promise<void> {
    await db
      .update(threads)
      .set({ isPinned })
      .where(eq(threads.id, id))
  }

  private mapToEntity(row: typeof threads.$inferSelect): ThreadEntity {
    return {
      id: row.id,
      boardId: row.boardId,
      subject: row.subject,
      content: row.content,
      author: row.author ?? "Awanama",
      createdAt: row.createdAt!,
      isPinned: row.isPinned ?? false,
      isLocked: row.isLocked ?? false,
      isDeleted: row.isDeleted ?? false,
      bumpedAt: row.bumpedAt!,
      image: row.image ?? undefined,
      postNumber: row.postNumber!,
    }
  }
}
