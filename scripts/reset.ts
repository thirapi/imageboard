import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    try {
        console.log("Resetting database...");

        await sql`DROP SCHEMA public CASCADE`;
        await sql`DROP SCHEMA drizzle CASCADE`;
        await sql`CREATE SCHEMA public`;

        console.log("Database reset successfully!");
    } catch (error) {
        console.error("L Error resetting database:", error);
        throw error;
    }
}

main();