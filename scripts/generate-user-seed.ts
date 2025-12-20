import { config } from "dotenv";
import { resolve } from "path";
import { hash } from "@node-rs/argon2";
import crypto from "crypto";  // Built-in Node
config({ path: resolve(__dirname, "../.env") });

/**
 * Skrip ini untuk menghasilkan pernyataan SQL untuk men-seed pengguna admin.
 * Jalankan dengan `npm run generate-user-seed`.
 * Set env: ADMIN_PASSWORD=rahasia-kuat-123 di .env.local.
 */
async function generateSeed() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('Error: Set ADMIN_PASSWORD di env vars!');
    process.exit(1);
  }

  console.log('Menghasilkan hash untuk admin...');

  try {
    // Custom Argon2 options (OWASP-compliant)
    const hashedPassword = await hash(adminPassword, {
      memoryCost: 19456,  // 19 MiB
      timeCost: 2,
      outputLen: 32,  // Salted hash length
    });

    console.log('Hash berhasil dibuat.');

    const adminId = crypto.randomUUID();  // Unik & random

    const sql = `
-- Seed untuk pengguna admin (idempotent) --
INSERT INTO "users" (id, email, "hashed_password", role)
VALUES ('${adminId}', '${adminEmail}', '${hashedPassword}', 'admin')
ON CONFLICT (email) DO NOTHING
RETURNING id;
    `;

    console.log('\n--- SALIN DAN TEMPEL SQL INI KE FILE MIGRASI DRIZZLE ---\n');
    console.log(sql);
  } catch (e) {
    console.error('Gagal hash password:', e);
    process.exit(1);
  }
}

generateSeed();