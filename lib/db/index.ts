import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema";
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cache } from 'react';

export const getDb = cache(() => {
  const { env } = getCloudflareContext();

  const connectionString = env.HYPERDRIVE.connectionString;

  if (!connectionString) {
    throw new Error('HYPERDRIVE binding tidak ditemukan. Pastikan sudah di-bind di wrangler.jsonc');
  }

  const client = postgres(connectionString, {
    max: 1,
    fetch_types: false,
    prepare: false,
    idle_timeout: 10,
    connect_timeout: 5,
  });

  return drizzle(client, { schema });
});

export const db = new Proxy({} as any, {
  get: (_, prop) => {
    const database = getDb();
    return (database as any)[prop];
  },
}) as ReturnType<typeof getDb>;