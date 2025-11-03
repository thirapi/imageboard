import { db } from "@/db";
import { users } from "@/db/schema";
import { IUserRepository } from "@/lib/application/repositories/user.repository.interface";
import { User } from "@/lib/types";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
  async getById(id: string): Promise<User | null> {
    const row = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row[0]) return null;

    return {
      id: row[0].id,
      name: row[0].name,
      avatar: row[0].avatar ?? undefined,
      isAnonymous: row[0].isAnonymous,
    };
  }

  async create(user: Partial<User>): Promise<User> {
    const [result] = await db
      .insert(users)
      .values({
        name: user.name!,
        avatar: user.avatar ?? null,
        isAnonymous: user.isAnonymous ?? true,
      })
      .returning();

    return {
      id: result.id,
      name: result.name,
      avatar: result.avatar ?? undefined,
      isAnonymous: result.isAnonymous,
    };
  }
}
