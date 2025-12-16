import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core"

export const reportContentTypeEnum = pgEnum("report_content_type", [
  "thread",
  "reply",
])

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "resolved",
  "dismissed",
])

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),

    contentType: reportContentTypeEnum("content_type").notNull(),
    contentId: serial("content_id").notNull(),

    reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("pending"),

    reportedAt: timestamp("reported_at", { withTimezone: true }).defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: varchar("resolved_by", { length: 100 }),
  },
  (t) => ({
    statusIdx: index("idx_reports_status").on(t.status),
  }),
)
