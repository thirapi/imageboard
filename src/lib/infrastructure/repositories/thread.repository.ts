import { db } from "@/db";
import { IThreadRepository } from "@/lib/application/repositories/thread.repository.interface";
import { threads } from "@/db/schema";
import { Thread } from "@/lib/types";
import { eq, sql, desc, or, ilike, } from "drizzle-orm";

export class ThreadRepository implements IThreadRepository {
  async getByBoard(boardId: string): Promise<Thread[]> {
    const rows = await db
      .select()
      .from(threads)
      .where(eq(threads.boardId, boardId));
    return rows.map((r) => ({
      id: r.id,
      boardId: r.boardId,
      title: r.title,
      content: r.content,
      image: r.image ?? undefined,
      author: r.author,
      createdAt: r.createdAt,
      replyCount: r.replyCount,
      lastReply: r.lastReply ?? undefined,
      isPinned: r.isPinned ?? false,
    }));
  }

  async getById(id: string): Promise<Thread | null> {
    const row = await db
      .select()
      .from(threads)
      .where(eq(threads.id, id))
      .limit(1);
    if (!row[0]) return null;
    return {
      id: row[0].id,
      boardId: row[0].boardId,
      title: row[0].title,
      content: row[0].content,
      image: row[0].image ?? undefined,
      author: row[0].author,
      createdAt: row[0].createdAt,
      replyCount: row[0].replyCount,
      lastReply: row[0].lastReply ?? undefined,
      isPinned: row[0].isPinned ?? false,
    };
  }

  async create(thread: Partial<Thread>): Promise<Thread> {
    const [result] = await db
      .insert(threads)
      .values({
        boardId: thread.boardId!,
        title: thread.title!,
        content: thread.content!,
        image: thread.image ?? null,
        author: thread.author ?? "Anonymous",
        createdAt: thread.createdAt ?? new Date(),
        replyCount: thread.replyCount ?? 0,
        lastReply: thread.lastReply ?? null,
        isPinned: thread.isPinned ?? false,
      })
      .returning();

    return {
      id: result.id,
      boardId: result.boardId,
      title: result.title,
      content: result.content,
      image: result.image ?? undefined,
      author: result.author,
      createdAt: result.createdAt,
      replyCount: result.replyCount,
      lastReply: result.lastReply ?? undefined,
      isPinned: result.isPinned ?? false,
    };
  }

  async incrementReplyCount(threadId: string, lastReply?: Date): Promise<void> {
    await db
      .update(threads)
      .set({
        replyCount: sql`${threads.replyCount} + 1`,
        lastReply: lastReply ?? new Date(),
      })
      .where(eq(threads.id, threadId));
  }

  async pinThread(threadId: string, isPinned: boolean): Promise<void> {
    await db.update(threads).set({ isPinned }).where(eq(threads.id, threadId));
  }
  async getPopular(limit: number): Promise<Thread[]> {
    const rows = await db
      .select()
      .from(threads)
      .orderBy(desc(threads.replyCount))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      boardId: row.boardId,
      title: row.title,
      content: row.content,
      image: row.image ?? undefined,
      author: row.author,
      createdAt: row.createdAt,
      replyCount: row.replyCount,
      lastReply: row.lastReply ?? undefined,
      isPinned: row.isPinned,
    }));
  }

async search(query: string): Promise<Thread[]> {
  if (!query.trim()) return [];

  const rows = await db
    .select()
    .from(threads)
    .where(
      or(
        ilike(threads.title, `%${query}%`),
        ilike(threads.content, `%${query}%`)
      )
    )
    .orderBy(desc(threads.createdAt))
    .limit(50);

  return rows.map((row) => ({
    ...row,
    image: row.image ?? undefined,
    lastReply: row.lastReply ?? undefined,
  }));
}

}
