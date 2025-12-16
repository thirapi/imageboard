import { db } from "@/lib/db"
import { images } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import type { ImageEntity, CreateImageInput } from "@/lib/entities/image.entity"

export class ImageRepository {
  async create(input: CreateImageInput): Promise<ImageEntity> {
    const rows = await db
      .insert(images)
      .values({
        url: input.url,
        publicId: input.publicId,
        threadId: input.threadId ?? null,
        replyId: input.replyId ?? null,
      })
      .returning()

    if (rows.length === 0) {
      throw new Error("Failed to save image metadata")
    }

    return this.mapToEntity(rows[0])
  }

  async findRecent(limit = 12): Promise<ImageEntity[]> {
    const rows = await db
      .select()
      .from(images)
      .orderBy(desc(images.createdAt))
      .limit(limit)

    return rows.map(this.mapToEntity)
  }

  private mapToEntity(row: typeof images.$inferSelect): ImageEntity {
    return {
      id: row.id,
      url: row.url,
      publicId: row.publicId,
      threadId: row.threadId ?? undefined,
      replyId: row.replyId ?? undefined,
      createdAt: row.createdAt!,
    }
  }
}
