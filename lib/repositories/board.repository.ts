import { db } from "@/lib/db"
import { boards } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import type { BoardEntity } from "@/lib/entities/board.entity"

export class BoardRepository {
  async findAll(): Promise<BoardEntity[]> {
    const rows = await db
      .select()
      .from(boards)
      .orderBy(asc(boards.code))

    return rows.map(this.mapToEntity)
  }

  async findByCode(code: string): Promise<BoardEntity | null> {
    const rows = await db
      .select()
      .from(boards)
      .where(eq(boards.code, code))
      .limit(1)

    if (rows.length === 0) {
      return null
    }

    return this.mapToEntity(rows[0])
  }

  async findById(id: number): Promise<BoardEntity | null> {
    const rows = await db
      .select()
      .from(boards)
      .where(eq(boards.id, id))
      .limit(1)

    if (rows.length === 0) {
      return null
    }

    return this.mapToEntity(rows[0])
  }

  private mapToEntity(row: typeof boards.$inferSelect): BoardEntity {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description ?? null,
    }
  }
}
