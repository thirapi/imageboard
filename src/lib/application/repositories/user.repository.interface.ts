import { User } from "@/lib/types";

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
}
