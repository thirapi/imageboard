
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { User } from '@/lib/entities/user.entity';
import { eq } from 'drizzle-orm';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!result) return null;

    // Map the database result to the User entity, ensuring type correctness
    return {
      ...result,
      role: result.role.toLowerCase() as 'user' | 'moderator' | 'admin',
    };
  }
}
