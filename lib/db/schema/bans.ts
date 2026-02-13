import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    index,
} from 'drizzle-orm/pg-core'

export const bans = pgTable(
    'bans',
    {
        id: serial('id').primaryKey(),
        ipAddress: varchar('ip_address', { length: 45 }).notNull(),
        reason: text('reason'),
        expiresAt: timestamp('expires_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    },
    (t) => ({
        ipIdx: index('idx_bans_ip').on(t.ipAddress),
        expiryIdx: index('idx_bans_expires_at').on(t.expiresAt),
    })
)
