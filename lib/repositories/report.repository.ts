import { db } from "@/lib/db"
import { reports } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import type { ReportEntity, CreateReportInput } from "@/lib/entities/report.entity"

export class ReportRepository {
  async create(input: CreateReportInput): Promise<ReportEntity> {
    const rows = await db
      .insert(reports)
      .values({
        contentType: input.contentType,
        contentId: input.contentId,
        reason: input.reason,
      })
      .returning()

    if (rows.length === 0) {
      throw new Error("Failed to create report")
    }

    return this.mapToEntity(rows[0])
  }

  async findAll(): Promise<ReportEntity[]> {
    const rows = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.reportedAt))

    return rows.map((row) => this.mapToEntity(row))
  }

  async findPending(): Promise<ReportEntity[]> {
    const rows = await db
      .select()
      .from(reports)
      .where(eq(reports.status, "pending"))
      .orderBy(desc(reports.reportedAt))

    return rows.map((row) => this.mapToEntity(row))
  }

  async updateStatus(
    id: number,
    status: "resolved" | "dismissed",
    resolvedBy: string,
  ): Promise<void> {
    await db
      .update(reports)
      .set({
        status,
        resolvedAt: new Date(),
        resolvedBy,
      })
      .where(eq(reports.id, id))
  }

  private mapToEntity(row: typeof reports.$inferSelect): ReportEntity {
    return {
      id: row.id,
      contentType: row.contentType,
      contentId: row.contentId,
      reason: row.reason,
      reportedAt: row.reportedAt!,
      status: row.status ?? "pending",
      resolvedAt: row.resolvedAt ?? undefined,
      resolvedBy: row.resolvedBy ?? undefined,
    }
  }
}
