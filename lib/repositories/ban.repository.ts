import { db } from "@/lib/db"
import { bans } from "@/lib/db/schema"
import { eq, and, gt, or, isNull } from "drizzle-orm"

export interface BanEntity {
    id: number
    ipAddress: string
    reason: string | null
    expiresAt: Date | null
    createdAt: Date
}

export class BanRepository {
    async findByIp(ip: string): Promise<BanEntity | null> {
        const now = new Date()

        // Check if there's an active ban for this IP
        // Active means either expiresAt is null (permanent) or expiresAt > now
        const row = await db.query.bans.findFirst({
            where: and(
                eq(bans.ipAddress, ip),
                or(
                    isNull(bans.expiresAt),
                    gt(bans.expiresAt, now)
                )
            )
        })

        if (!row) return null

        return {
            id: row.id,
            ipAddress: row.ipAddress,
            reason: row.reason,
            expiresAt: row.expiresAt,
            createdAt: row.createdAt!
        }
    }

    async create(input: { ipAddress: string; reason?: string; expiresAt?: Date }): Promise<void> {
        await db.insert(bans).values({
            ipAddress: input.ipAddress,
            reason: input.reason ?? null,
            expiresAt: input.expiresAt ?? null
        })
    }

    async deleteByIp(ip: string): Promise<void> {
        await db.delete(bans).where(eq(bans.ipAddress, ip))
    }

    async findAll(): Promise<BanEntity[]> {
        const rows = await db.query.bans.findMany({
            orderBy: (bans, { desc }) => [desc(bans.createdAt)]
        })

        return rows.map(row => ({
            id: row.id,
            ipAddress: row.ipAddress,
            reason: row.reason,
            expiresAt: row.expiresAt,
            createdAt: row.createdAt!
        }))
    }

    async update(id: number, input: { reason?: string; expiresAt?: Date | null }): Promise<void> {
        await db.update(bans).set({
            reason: input.reason,
            expiresAt: input.expiresAt
        }).where(eq(bans.id, id))
    }
}
