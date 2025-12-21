import { sql } from "drizzle-orm";
import { db } from "../db";

export class SequenceService {
  async getNextPostNumber(): Promise<number> {
    const result = await db.execute(
      sql`SELECT nextval('post_number_seq') as value`
    );

    return result[0].value as number;
  }
}
