import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq, gt, sql } from "drizzle-orm";
import { subMinutes } from "date-fns";
import { ISessionRepository } from "@/lib/application/repositories/session.repository.interface";

export class SessionRepository implements ISessionRepository {
  async upsertSession(sessionId: string, ip: string, userAgent: string) {
    const now = new Date();
    await db
      .insert(sessions)
      .values({
        id: sessionId,
        ip,
        userAgent,
        lastSeen: now,
      })
      .onConflictDoUpdate({
        target: sessions.id,
        set: { lastSeen: now, ip, userAgent },
      });
  }

  async countActiveUsers(sinceMinutes: number): Promise<number> {
    const cutoff = subMinutes(new Date(), sinceMinutes);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(sessions)
      .where(gt(sessions.lastSeen, cutoff));

    return result[0].count;
  }
}
