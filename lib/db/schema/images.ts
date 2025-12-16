import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
  varchar,
} from 'drizzle-orm/pg-core'
import { threads } from './threads'
import { replies } from './replies'

export const images = pgTable(
  'images',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    publicId: varchar('public_id', { length: 255 }).notNull(),

    threadId: integer('thread_id').references(() => threads.id, {
      onDelete: 'cascade',
    }),
    replyId: integer('reply_id').references(() => replies.id, {
      onDelete: 'cascade',
    }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    threadIdx: index('idx_images_thread_id').on(t.threadId),
    replyIdx: index('idx_images_reply_id').on(t.replyId),
    createdIdx: index('idx_images_created_at').on(t.createdAt),
  })
)
