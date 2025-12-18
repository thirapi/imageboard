
import { LoginUseCase } from '@/lib/use-cases/login.use-case';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(formData: FormData) {
    const validatedFields = loginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      // Sesuai arsitektur, Controller melempar error validasi
      throw new Error(validatedFields.error.errors.map((e) => e.message).join('\n'));
    }

    // Panggil use case hanya dengan data yang bersih
    return this.loginUseCase.execute(validatedFields.data);
  }
}
