"use server"

import { db } from "@/lib/db"
import { threads, replies } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function deletePost(postId: number, postType: "thread" | "reply", password?: string) {
    try {
        if (postType === "thread") {
            const row = await db.query.threads.findFirst({
                where: eq(threads.id, postId),
            })

            if (!row) throw new Error("Thread tidak ditemukan")

            // Verification: Check password (plain text as stored)
            // Note: In a real app, if password is null, only moderator could delete.
            // But for imageboards, if no password, you can't self-delete.
            if (!row.deletionPassword || row.deletionPassword !== password) {
                throw new Error("Sandi penghapusan salah atau tidak diatur")
            }

            await db.update(threads).set({ isDeleted: true }).where(eq(threads.id, postId))
        } else {
            const row = await db.query.replies.findFirst({
                where: eq(replies.id, postId),
            })

            if (!row) throw new Error("Balasan tidak ditemukan")

            if (!row.deletionPassword || row.deletionPassword !== password) {
                throw new Error("Sandi penghapusan salah atau tidak diatur")
            }

            await db.update(replies).set({ isDeleted: true }).where(eq(replies.id, postId))
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus postingan" }
    }
}

export async function searchThreads(boardId: number, query: string) {
    // Basic search functionality
    try {
        const results = await db.query.threads.findMany({
            where: and(
                eq(threads.boardId, boardId),
                eq(threads.isDeleted, false)
            )
        })

        // Filter by query (could do this in SQL but manual filter for simple content search)
        const q = query.toLowerCase()
        return results.filter(t =>
            (t.subject?.toLowerCase().includes(q) || t.content.toLowerCase().includes(q))
        )
    } catch (error) {
        console.error("Search error:", error)
        return []
    }
}
