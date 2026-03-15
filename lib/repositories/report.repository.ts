import { db } from "@/lib/db"
import { reports } from "@/lib/db/schema"
import { desc, eq, or, sql, inArray } from "drizzle-orm"
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

  async findPendingPaged(limit: number, offset: number, boardId?: number): Promise<ReportEntity[]> {
    const whereClause = boardId 
      ? sql`status = 'pending' AND (
          (content_type = 'thread' AND EXISTS (SELECT 1 FROM threads WHERE threads.id = reports.content_id AND threads.board_id = ${boardId}))
          OR
          (content_type = 'reply' AND EXISTS (SELECT 1 FROM replies JOIN threads ON replies.thread_id = threads.id WHERE replies.id = reports.content_id AND threads.board_id = ${boardId}))
        )`
      : eq(reports.status, "pending")

    const rows = await db
      .select()
      .from(reports)
      .where(whereClause)
      .orderBy(desc(reports.reportedAt))
      .limit(limit)
      .offset(offset)

    return rows.map(this.mapToEntity)
  }

  async countPending(boardId?: number): Promise<number> {
    let whereClause = sql`status = 'pending'`
    
    if (boardId) {
      whereClause = sql`
        status = 'pending' AND (
          (content_type = 'thread' AND EXISTS (SELECT 1 FROM threads WHERE threads.id = reports.content_id AND threads.board_id = ${boardId}))
          OR
          (content_type = 'reply' AND EXISTS (SELECT 1 FROM replies JOIN threads ON replies.thread_id = threads.id WHERE replies.id = reports.content_id AND threads.board_id = ${boardId}))
        )
      `
    }

    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(whereClause)
    return Number(row?.count || 0)
  }

  async findResolved(): Promise<ReportEntity[]> {
    const rows = await db
      .select()
      .from(reports)
      .where(or(eq(reports.status, "resolved"), eq(reports.status, "dismissed")))
      .orderBy(desc(reports.reportedAt))

    return rows.map((row) => this.mapToEntity(row))
  }

  async findResolvedPaged(limit: number, offset: number, boardId?: number): Promise<ReportEntity[]> {
    const whereClause = boardId 
      ? sql`status != 'pending' AND (
          (content_type = 'thread' AND EXISTS (SELECT 1 FROM threads WHERE threads.id = reports.content_id AND threads.board_id = ${boardId}))
          OR
          (content_type = 'reply' AND EXISTS (SELECT 1 FROM replies JOIN threads ON replies.thread_id = threads.id WHERE replies.id = reports.content_id AND threads.board_id = ${boardId}))
        )`
      : or(eq(reports.status, "resolved"), eq(reports.status, "dismissed"))

    const rows = await db
      .select()
      .from(reports)
      .where(whereClause)
      .orderBy(desc(reports.resolvedAt))
      .limit(limit)
      .offset(offset)

    return rows.map((row) => this.mapToEntity(row))
  }

  async countResolved(boardId?: number): Promise<number> {
    const whereClause = boardId 
      ? sql`status != 'pending' AND (
          (content_type = 'thread' AND EXISTS (SELECT 1 FROM threads WHERE threads.id = reports.content_id AND threads.board_id = ${boardId}))
          OR
          (content_type = 'reply' AND EXISTS (SELECT 1 FROM replies JOIN threads ON replies.thread_id = threads.id WHERE replies.id = reports.content_id AND threads.board_id = ${boardId}))
        )`
      : or(eq(reports.status, "resolved"), eq(reports.status, "dismissed"))

    const result = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(reports)
      .where(whereClause)

    return result[0]?.count ?? 0
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

  async updateStatusBulk(
    ids: number[],
    status: "resolved" | "dismissed",
    resolvedBy: string,
  ): Promise<void> {
    if (ids.length === 0) return
    await db
      .update(reports)
      .set({
        status,
        resolvedAt: new Date(),
        resolvedBy,
      })
      .where(inArray(reports.id, ids))
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
