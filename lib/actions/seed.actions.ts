"use server";

import { container } from "@/lib/di/container";
import type { SeedBoardInput, SeedBoardResult } from "@/lib/entities/seed.entity";

const { seedController } = container;

export async function seedBoardAction(input: SeedBoardInput): Promise<SeedBoardResult> {
    try {
        return await seedController.seedBoard(input);
    } catch (error) {
        console.error("Error seeding board:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to seed board");
    }
}
