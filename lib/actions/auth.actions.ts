'use server'

import { lucia } from '@/lib/auth';
import { AuthController } from '@/lib/controllers/auth.controller';
import { UserRepository } from '@/lib/repositories/user.repository';
import { LoginUseCase } from '@/lib/use-cases/login.use-case';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server Action untuk login.
 * Bertindak sebagai Composition Root dan menangani interaksi dengan framework.
 */
export async function login(prevState: any, formData: FormData) {
  // 1. Dependency Injection (Composition Root)
  const userRepository = new UserRepository();
  const loginUseCase = new LoginUseCase(userRepository);
  const authController = new AuthController(loginUseCase);

  try {
    // 2. Teruskan permintaan ke Controller
    const user = await authController.login(formData);

    // 3. Tangani efek samping spesifik framework (Session, Cookies)
    const session = await lucia.createSession(user.id, {
      role: user.role,
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 4. Navigasi (juga efek samping spesifik framework)
    // Ini harus dipanggil di luar try/catch sesuai dokumentasi Next.js
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }

  // Panggil redirect di luar blok try-catch
  return redirect('/mod');
}

/**
 * Server Action untuk logout.
 */
export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value || null;

  if (!sessionId) {
    return redirect('/mod/login');
  }

  const { session } = await lucia.validateSession(sessionId);
  if (!session) {
    return redirect('/mod/login');
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/mod/login');
}
