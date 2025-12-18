
import { User } from '@/lib/entities/user.entity';
import { IUserRepository } from '@/lib/repositories/user.repository';
import { verify } from "@node-rs/argon2";

interface ILoginCredentials {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: ILoginCredentials): Promise<User> {
    const existingUser = await this.userRepository.getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await verify(
      existingUser.hashedPassword,
      password
    );

    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    return existingUser;
  }
}
