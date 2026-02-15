import type {
    SeedBoardInput,
    SeedBoardResult,
} from "@/lib/entities/seed.entity";
import type { ThreadRepository } from "@/lib/repositories/thread.repository";
import type { ReplyRepository } from "@/lib/repositories/reply.repository";
import type { SequenceService } from "@/lib/services/sequence.service";
import type { CreateThreadInput } from "@/lib/entities/thread.entity";
import type { CreateReplyInput } from "@/lib/entities/reply.entity";

export class SeedBoardLoadTestUseCase {
    constructor(
        private threadRepository: ThreadRepository,
        private replyRepository: ReplyRepository,
        private sequenceService: SequenceService,
    ) { }

    async execute(input: SeedBoardInput): Promise<SeedBoardResult> {
        const startTime = Date.now();
        let totalThreadsCreated = 0;
        let totalRepliesCreated = 0;

        // Configuration
        const BATCH_SIZE = 1000;
        const { boardId, threadCount, maxRepliesPerThread, monthsBack } = input;

        // Pre-calculate reply counts to estimate total sequence needed
        // Ideally we fetch sequence in huge chunks. 
        // Let's just fetch per batch of threads to be safe with memory, but optimized.

        for (let i = 0; i < threadCount; i += BATCH_SIZE) {
            const currentBatchSize = Math.min(BATCH_SIZE, threadCount - i);

            // 1. Prepare Thread Data & Calculate Replies
            const threadInputs: CreateThreadInput[] = [];
            const threadReplyCounts: number[] = [];
            let totalRepliesInBatch = 0;

            for (let j = 0; j < currentBatchSize; j++) {
                const replyCount = this.getReplyCountDistribution(maxRepliesPerThread);
                threadReplyCounts.push(replyCount);
                totalRepliesInBatch += replyCount;
            }

            // 2. Fetch ALL Post Numbers for this batch (Threads + Replies)
            // This reduces DB calls from 2 to 1 per batch, or N+1 to 1.
            const totalPostNumbersNeeded = currentBatchSize + totalRepliesInBatch;
            const allPostNumbers = await this.sequenceService.getNextPostNumbers(totalPostNumbersNeeded);

            let postNumIndex = 0;

            // 3. Build Thread Inputs
            for (let j = 0; j < currentBatchSize; j++) {
                const createdAt = this.getRandomDate(monthsBack);

                threadInputs.push({
                    boardId: boardId,
                    content: `Load Test Thread ${i + j + 1} - ${this.randomString(20)}`,
                    postNumber: allPostNumbers[postNumIndex++],
                    author: "LoadTester",
                    createdAt: createdAt,
                    bumpedAt: createdAt,
                    image: null,
                    deletionPassword: "test",
                    isNsfw: false,
                    isSpoiler: false,
                });
            }

            // 4. Bulk Insert Threads
            // NOW returns only { id }
            const createdThreads = await this.threadRepository.bulkCreate(threadInputs);
            totalThreadsCreated += createdThreads.length;


            // 5. Build Reply Inputs
            const replyInputs: CreateReplyInput[] = [];

            createdThreads.forEach((thread, index) => {
                const count = threadReplyCounts[index];
                if (count === 0) return;

                // We use the INPUT's createdAt because we know it matches what we sent to DB
                // and the DB returns only ID now.
                let lastReplyTime = threadInputs[index].createdAt!;

                for (let r = 0; r < count; r++) {
                    const replyTime = new Date(lastReplyTime.getTime() + Math.random() * 1000 * 60 * 60);
                    lastReplyTime = replyTime;

                    replyInputs.push({
                        threadId: thread.id,
                        content: `Reply ${r + 1} to thread ${thread.id} - ${this.randomString(10)}`,
                        postNumber: allPostNumbers[postNumIndex++],
                        author: "ReplyBot",
                        createdAt: replyTime,
                        deletionPassword: "test",
                        isNsfw: false,
                        isSpoiler: false,
                        image: null
                    });
                }
            });

            // 6. Bulk Insert Replies
            const REPLY_BATCH_SIZE = 2000; // Increased batch size
            for (let k = 0; k < replyInputs.length; k += REPLY_BATCH_SIZE) {
                const chunk = replyInputs.slice(k, k + REPLY_BATCH_SIZE);
                await this.replyRepository.bulkCreate(chunk);
            }

            totalRepliesCreated += replyInputs.length;
        }

        const duration = Date.now() - startTime;

        return {
            totalThreadsCreated,
            totalRepliesCreated,
            durationMs: duration,
        };
    }

    private getRandomDate(monthsBack: number): Date {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - monthsBack);
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
    }

    private getReplyCountDistribution(max: number): number {
        const r = Math.random();
        if (r < 0.7) {
            // 70%: 0-10 replies
            return Math.floor(Math.random() * 11);
        } else if (r < 0.9) {
            // 20%: 10-50 replies
            // Validated against max
            const high = Math.min(50, max);
            const low = 10;
            if (high < low) return high;
            return Math.floor(Math.random() * (high - low + 1)) + low;
        } else {
            // 10%: 50-max replies
            if (max < 50) return max;
            return Math.floor(Math.random() * (max - 50 + 1)) + 50;
        }
    }

    private randomString(length: number): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }
}
