import { sql } from "drizzle-orm";
import { db } from "../db";

export class SequenceService {
  async getNextPostNumber(): Promise<number> {
    const result = await db.execute(
      sql`SELECT nextval('post_number_seq') as value`
    );

    return result[0].value as number;
  }
  async getNextPostNumbers(count: number): Promise<number[]> {
    if (count <= 0) return [];

    // Postgres specific: batch fetch sequence values
    const result = await db.execute(
      sql`SELECT nextval('post_number_seq') as value FROM generate_series(1, ${count})`
    );

    return result.map((r) => r.value as number);
  }
}
