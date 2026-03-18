import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core'

export const boardCategories = pgTable('board_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0).unique(),
})
