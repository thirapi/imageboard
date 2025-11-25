'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action to manually trigger a revalidation of the home page cache.
 */
export async function revalidateHomePage() {
  revalidatePath('/');
}
