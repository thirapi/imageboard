// scripts/reset-db.ts
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
    try {
        console.log("Resetting Supabase database...");

        await sql`DROP SCHEMA IF EXISTS public CASCADE`;
        await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;
        await sql`CREATE SCHEMA public`;

        console.log("Database reset successfully!");
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
