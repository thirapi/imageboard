'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action to manually trigger a revalidation of a specific path.
 * @param path The path to revalidate, e.g., '/', or '/board/tech'.
 */
export async function revalidatePageByPath(path: string) {
  revalidatePath(path);
}
