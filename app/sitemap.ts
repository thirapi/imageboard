import type { MetadataRoute } from "next";
import { BoardRepository } from "@/lib/repositories/board.repository";
import { ThreadRepository } from "@/lib/repositories/thread.repository";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://62chan.my.id").replace(/\/$/, "");

    // 1. Homepage & Static Pages
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "hourly" as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/rules`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },
    ];

    try {
        // 2. All Boards
        const boardRepository = new BoardRepository();
        const boards = await boardRepository.findAll();

        const boardRoutes = boards.map((board) => ({
            url: `${baseUrl}/${board.code}`,
            lastModified: new Date(),
            changeFrequency: "hourly" as const,
            priority: 0.8,
        }));

        // 3. Latest Threads (Reduced to 50 for performance)
        const threadRepository = new ThreadRepository();
        const latestThreads = await threadRepository.findLatest(50);

        const threadRoutes = latestThreads.map((thread) => {
            const board = boards.find((b) => b.id === thread.boardId);
            if (!board) return null;

            return {
                url: `${baseUrl}/${board.code}/thread/${thread.id}`,
                lastModified: thread.bumpedAt || thread.createdAt,
                changeFrequency: "daily" as const,
                priority: 0.6,
            };
        }).filter((route) => route !== null);

        const allRoutes = [...routes, ...boardRoutes, ...threadRoutes];

        return allRoutes.map(route => ({
            ...route,
            lastModified: route?.lastModified instanceof Date
                ? route.lastModified.toISOString()
                : route?.lastModified
        })) as MetadataRoute.Sitemap;
    } catch (error) {
        console.error("Error generating dynamic sitemap routes:", error);
        // Fallback to only static routes if DB fails
        return routes.map(route => ({
            ...route,
            lastModified: route?.lastModified instanceof Date
                ? route.lastModified.toISOString()
                : route?.lastModified
        })) as MetadataRoute.Sitemap;
    }
}
