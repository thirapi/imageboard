import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { threads } from './threads'

export const replies = pgTable(
  'replies',
  {
    id: serial('id').primaryKey(),
    postNumber: integer('post_number').unique(),

    threadId: integer('thread_id')
      .notNull()
      .references(() => threads.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),
    author: varchar('author', { length: 100 }).default('Awanama'),

    image: text('image'),
    isDeleted: boolean('is_deleted').default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    threadIdx: index('idx_replies_thread_id').on(t.threadId),
    deletedIdx: index('idx_replies_is_deleted').on(t.isDeleted),
  })
)
