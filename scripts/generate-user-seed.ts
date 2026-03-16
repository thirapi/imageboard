import { config } from "dotenv";
import { resolve } from "path";
import { PasswordService } from "../lib/services/password.service";
import crypto from "crypto";  // Built-in Node
config({ path: resolve(__dirname, "../.env") });

/**
 * Skrip ini untuk menghasilkan pernyataan SQL untuk men-seed pengguna admin.
 * Jalankan dengan `npm run generate-user-seed`.
 * Set env: ADMIN_PASSWORD=rahasia-kuat-123 di .env.local.
 */
async function generateSeed() {
  const passwordService = new PasswordService();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('Error: Set ADMIN_PASSWORD di env vars!');
    process.exit(1);
  }

  console.log('Menghasilkan hash untuk admin...');

  try {
    const hashedPassword = await passwordService.hash(adminPassword);

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