import { db } from "@/lib/db"
import { boardCategories } from "@/lib/db/schema"
import { asc, eq, sql } from "drizzle-orm"
import type { BoardCategoryEntity } from "@/lib/entities/board.entity"

export class BoardCategoryRepository {
  async findAll(): Promise<BoardCategoryEntity[]> {
    const rows = await db
      .select()
      .from(boardCategories)
      .orderBy(asc(boardCategories.displayOrder), asc(boardCategories.id))

    return rows.map(this.mapToEntity)
  }

  async findById(id: number): Promise<BoardCategoryEntity | null> {
    const rows = await db
      .select()
      .from(boardCategories)
      .where(eq(boardCategories.id, id))
      .limit(1)

    if (rows.length === 0) return null
    return this.mapToEntity(rows[0])
  }

  async create(data: Omit<BoardCategoryEntity, "id">): Promise<BoardCategoryEntity> {
    const [row] = await db.insert(boardCategories).values(data).returning()
    return this.mapToEntity(row)
  }

  async update(id: number, data: Partial<Omit<BoardCategoryEntity, "id">>): Promise<BoardCategoryEntity> {
    const [row] = await db
      .update(boardCategories)
      .set(data)
      .where(eq(boardCategories.id, id))
      .returning()
    return this.mapToEntity(row)
  }

  async delete(id: number): Promise<void> {
    await db.delete(boardCategories).where(eq(boardCategories.id, id))
  }

  async updateAllOrders(orderedIds: number[]): Promise<void> {
    await db.transaction(async (tx) => {
      // 1. Pindahkan sementara ke nilai negatif agar tidak membentur UNIQUE constraint
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.update(boardCategories)
          .set({ displayOrder: -(i + 1) })
          .where(eq(boardCategories.id, orderedIds[i]))
      }
      
      // 2. Terapkan nilai urutan (displayOrder) yang bersih mulai dari 1..N
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.update(boardCategories)
          .set({ displayOrder: i + 1 })
          .where(eq(boardCategories.id, orderedIds[i]))
      }
    })
  }

  private mapToEntity(row: typeof boardCategories.$inferSelect): BoardCategoryEntity {
    return {
      id: row.id,
      name: row.name,
      displayOrder: row.displayOrder,
    }
  }
}
