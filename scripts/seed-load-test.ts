import { container } from "../lib/di/container";
import { config } from "dotenv";

config({ path: ".env" });

async function main() {
    const args = process.argv.slice(2);
    const boardId = args[0] ? parseInt(args[0]) : null;
    const threadCount = args[1] ? parseInt(args[1]) : 1000;
    const maxRepliesPerThread = args[2] ? parseInt(args[2]) : 50;
    const monthsBack = args[3] ? parseInt(args[3]) : 6;

    if (!boardId) {
        console.error("Usage: tsx scripts/seed-load-test.ts <boardId> [threadCount] [maxReplies] [monthsBack]");
        console.error("Example: tsx scripts/seed-load-test.ts 1 5000 100 6");
        process.exit(1);
    }

    console.log(`🚀 Starting load test seed for Board ID: ${boardId}`);
    console.log(`Threads: ${threadCount}, Max Replies: ${maxRepliesPerThread}, Time Window: ${monthsBack} months`);

    try {
        const result = await container.seedController.seedBoard({
            boardId,
            threadCount,
            maxRepliesPerThread,
            monthsBack,
        });

        console.log("\n✅ Seeding Complete!");
        console.log(`Total Threads: ${result.totalThreadsCreated.toLocaleString()}`);
        console.log(`Total Replies: ${result.totalRepliesCreated.toLocaleString()}`);
        console.log(`Duration: ${(result.durationMs / 1000).toFixed(2)}s`);
        console.log(`Rate: ${((result.totalThreadsCreated + result.totalRepliesCreated) / (result.durationMs / 1000)).toFixed(0)} items/sec`);

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Seeding Failed:", error);
        process.exit(1);
    }
}

main();
