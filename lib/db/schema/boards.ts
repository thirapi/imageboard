import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { boardCategories } from './board_categories'

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => boardCategories.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
