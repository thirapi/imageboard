import { db } from "@/db";
import { boards } from "@/db/schema";
import { IBoardRepository } from "@/lib/application/repositories/board.repository.interface";
import { Board } from "@/lib/types";
import { eq, sql } from "drizzle-orm";

export class BoardRepository implements IBoardRepository {
  async getAll(): Promise<Board[]> {
    const rows = await db.select().from(boards);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      threadCount: r.threadCount,
    }));
  }

  async getById(id: string): Promise<Board | null> {
    const row = await db
      .select()
      .from(boards)
      .where(eq(boards.id, id))
      .limit(1);
    if (!row[0]) return null;
    return {
      id: row[0].id,
      name: row[0].name,
      description: row[0].description ?? undefined,
      threadCount: row[0].threadCount,
    };
  }

  async create(board: Partial<Board>): Promise<Board> {
    const [result] = await db
      .insert(boards)
      .values({
        name: board.name!,
        description: board.description ?? null,
        threadCount: board.threadCount ?? 0,
      })
      .returning();

    return result as Board;
  }

  async incrementThreadCount(boardId: string): Promise<void> {
    await db
      .update(boards)
      .set({
        threadCount: sql`${boards.threadCount} + 1`,
      })
      .where(eq(boards.id, boardId));
  }
}
