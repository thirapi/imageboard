import { db } from "@/lib/db"
import { boards, boardCategories } from "@/lib/db/schema"
import { asc, eq, inArray } from "drizzle-orm"
import type { BoardEntity } from "@/lib/entities/board.entity"

export class BoardRepository {
  async findAll(): Promise<BoardEntity[]> {
    const rows = await db
      .select({
        board: boards,
        category: boardCategories,
      })
      .from(boards)
      .leftJoin(boardCategories, eq(boards.categoryId, boardCategories.id))
      .orderBy(asc(boards.code))

    return rows.map((r) => this.mapToEntity(r.board, r.category))
  }

  async findByCode(code: string): Promise<BoardEntity | null> {
    const rows = await db
      .select({
        board: boards,
        category: boardCategories,
      })
      .from(boards)
      .leftJoin(boardCategories, eq(boards.categoryId, boardCategories.id))
      .where(eq(boards.code, code))
      .limit(1)

    if (rows.length === 0) {
      return null
    }

    return this.mapToEntity(rows[0].board, rows[0].category)
  }

  async findById(id: number): Promise<BoardEntity | null> {
    const rows = await db
      .select({
        board: boards,
        category: boardCategories,
      })
      .from(boards)
      .leftJoin(boardCategories, eq(boards.categoryId, boardCategories.id))
      .where(eq(boards.id, id))
      .limit(1)

    if (rows.length === 0) {
      return null
    }

    return this.mapToEntity(rows[0].board, rows[0].category)
  }

  async findManyByIds(ids: number[]): Promise<BoardEntity[]> {
    if (ids.length === 0) return []
    const rows = await db
      .select({
        board: boards,
        category: boardCategories,
      })
      .from(boards)
      .leftJoin(boardCategories, eq(boards.categoryId, boardCategories.id))
      .where(inArray(boards.id, ids))

    return rows.map((r) => this.mapToEntity(r.board, r.category))
  }

  async create(data: Omit<BoardEntity, "id" | "categoryName">): Promise<BoardEntity> {
    const [row] = await db.insert(boards).values(data).returning()
    return this.mapToEntity(row)
  }

  async update(id: number, data: Partial<Omit<BoardEntity, "id" | "categoryName">>): Promise<BoardEntity> {
    const [row] = await db
      .update(boards)
      .set(data)
      .where(eq(boards.id, id))
      .returning()
    return this.mapToEntity(row)
  }

  async delete(id: number): Promise<void> {
    await db.delete(boards).where(eq(boards.id, id))
  }

  async clearCategoryForBoards(categoryId: number): Promise<void> {
    await db
      .update(boards)
      .set({ categoryId: null })
      .where(eq(boards.categoryId, categoryId))
  }

  private mapToEntity(
    row: typeof boards.$inferSelect,
    category?: typeof boardCategories.$inferSelect | null
  ): BoardEntity {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description ?? null,
      categoryId: row.categoryId ?? null,
      categoryName: category?.name ?? null,
    }
  }
}
