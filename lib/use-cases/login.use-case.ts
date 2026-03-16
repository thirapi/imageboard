
import { User } from '@/lib/entities/user.entity';
import { IUserRepository } from '@/lib/repositories/user.repository';
import { PasswordService } from "../services/password.service"

interface ILoginCredentials {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: PasswordService
  ) {}

  async execute({ email, password }: ILoginCredentials): Promise<User> {
    const existingUser = await this.userRepository.getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await this.passwordService.verify(
      existingUser.hashedPassword,
      password
    );

    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    return existingUser;
  }
}
