import type { MetadataRoute } from "next";
import { BoardRepository } from "@/lib/repositories/board.repository";
import { ThreadRepository } from "@/lib/repositories/thread.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://boards.slug.my.id";

    // 1. Homepage
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "always" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/rules`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },
    ];

    // 2. All Boards
    const boardRepository = new BoardRepository();
    const boards = await boardRepository.findAll();

    const boardRoutes = boards.map((board) => ({
        url: `${baseUrl}/${board.code}`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.8,
    }));

    // 3. Latest Threads (e.g. last 100)
    const threadRepository = new ThreadRepository();
    const latestThreads = await threadRepository.findLatest(100);

    const threadRoutes = latestThreads.map((thread) => {
        // We need to find the board code for each thread to build the URL correctly
        // Since findLatest likely returns threads without board codes (only boardIds),
        // we should ideally fetch with join or map from boards list
        const board = boards.find((b) => b.id === thread.boardId);
        return {
            url: `${baseUrl}/${board?.code || "board"}/thread/${thread.id}`,
            lastModified: thread.bumpedAt || thread.createdAt,
            changeFrequency: "daily" as const,
            priority: 0.6,
        };
    });

    return [...routes, ...boardRoutes, ...threadRoutes];
}
