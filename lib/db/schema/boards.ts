import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
