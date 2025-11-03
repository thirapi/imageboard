import { pgTable, uuid, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const boards = pgTable("boards", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  threadCount: integer("thread_count").default(0).notNull(),
});

export const threads = pgTable("threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  boardId: text("board_id")
    .references(() => boards.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  image: text("image"),
  author: varchar("author", { length: 100 }).default("Anonymous").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  lastReply: timestamp("last_reply"),
  isPinned: boolean("is_pinned").default(false).notNull(),
});

export const replies = pgTable(
  "replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    threadId: uuid("thread_id").notNull(),
    content: text("content").notNull(),
    image: text("image"),
    author: varchar("author", { length: 100 }).default("Anonymous").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    replyTo: uuid("reply_to"),
  },
  (table) => ({
    replyToFk: {
      columns: [table.replyTo],
      foreignColumns: [table.id],
    },
  })
);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  avatar: text("avatar"),
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  ip: varchar("ip").notNull(),
  userAgent: varchar("user_agent").notNull(),
  lastSeen: timestamp("last_seen").notNull(),
});
