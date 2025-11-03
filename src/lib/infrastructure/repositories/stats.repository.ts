import { IStatsRepository } from "@/lib/application/repositories/stats.repository.interface";
import { db } from "@/db";
import { threads, replies } from "@/db/schema";
import { count } from "drizzle-orm";

export class StatsRepository implements IStatsRepository {
  async getTotalThreads(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(threads);

    return result[0]?.count ?? 0;
  }

  async getTotalReplies(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(replies);

    return result[0]?.count ?? 0;
  }
}
