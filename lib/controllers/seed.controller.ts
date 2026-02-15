import type { SeedBoardLoadTestUseCase } from "@/lib/use-cases/seed-board.use-case";
import type { SeedBoardInput } from "@/lib/entities/seed.entity";

export class SeedController {
    constructor(private seedBoardUseCase: SeedBoardLoadTestUseCase) { }

    async seedBoard(input: SeedBoardInput) {
        // Basic validation
        if (!input.boardId) {
            throw new Error("Board ID is required");
        }
        if (input.threadCount <= 0) {
            throw new Error("Thread count must be greater than 0");
        }

        return await this.seedBoardUseCase.execute(input);
    }
}
