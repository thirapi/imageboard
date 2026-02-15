export interface SeedBoardInput {
    boardId: number; // Changed from string to number as our internal ID is number
    threadCount: number;
    maxRepliesPerThread: number;
    monthsBack: number;
}

export interface SeedBoardResult {
    totalThreadsCreated: number;
    totalRepliesCreated: number;
    durationMs: number;
}
