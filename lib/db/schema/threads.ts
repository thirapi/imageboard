import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { boards } from './boards'

export const threads = pgTable(
  'threads',
  {
    id: serial('id').primaryKey(),
    postNumber: integer('post_number').unique(),

    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),

    subject: varchar('subject', { length: 200 }),
    content: text('content').notNull(),
    author: varchar('author', { length: 100 }).default('Awanama'),

    image: text('image'),
    isDeleted: boolean('is_deleted').default(false),

    isPinned: boolean('is_pinned').default(false),
    isLocked: boolean('is_locked').default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    bumpedAt: timestamp('bumped_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    boardIdx: index('idx_threads_board_id').on(t.boardId),
    bumpedIdx: index('idx_threads_bumped_at').on(t.bumpedAt),
    deletedIdx: index('idx_threads_is_deleted').on(t.isDeleted),
  })
)
