"use server"

import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";

/**
 * Get the currently authenticated user session.
 * Cached for the duration of the request using React cache().
 */
export const getAuthUser = cache(async () => {
  await connection();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value || null;
  if (!sessionId) return null;

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) return null;

  return user;
});
