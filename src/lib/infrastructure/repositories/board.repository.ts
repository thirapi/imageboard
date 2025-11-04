import { db } from "@/db";
import { boards, threads } from "@/db/schema";
import { IBoardRepository } from "@/lib/application/repositories/board.repository.interface";
import { Board } from "@/lib/types";
import { eq, sql, count } from "drizzle-orm";

export class BoardRepository implements IBoardRepository {
  async getAll(): Promise<Board[]> {
    const rows = await db
      .select({
        id: boards.id,
        name: boards.name,
        description: boards.description,
        threadCount: count(threads.id),
      })
      .from(boards)
      .leftJoin(threads, eq(boards.id, threads.boardId))
      .groupBy(boards.id, boards.name, boards.description);

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      threadCount: r.threadCount,
    }));
  }

  async getById(id: string): Promise<Board | null> {
    const rows = await db
      .select({
        id: boards.id,
        name: boards.name,
        description: boards.description,
        threadCount: count(threads.id),
      })
      .from(boards)
      .leftJoin(threads, eq(boards.id, threads.boardId))
      .where(eq(boards.id, id))
      .groupBy(boards.id, boards.name, boards.description);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      threadCount: row.threadCount,
    };
  }

  async create(board: Partial<Board>): Promise<Board> {
    if (!board.id) throw new Error("Board ID is required");

    const [result] = await db
      .insert(boards)
      .values({
        id: board.id,
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
