"use server"

import { container } from "@/lib/di/container"
import { revalidatePath } from "next/cache"

const { moderationController, createReportUseCase } = container

function checkModeratorAuth() {
  const modToken = process.env.MODERATOR_TOKEN
  if (!modToken) {
    throw new Error("Moderator authentication not configured")
  }
  // In production, this would check against a session or JWT
  // For now, we rely on environment variable
  return true
}

async function handleModerationAction(action: Promise<any>, revalidate: string | null = "/mod") {
  try {
    checkModeratorAuth()
    await action
    if (revalidate) {
      revalidatePath(revalidate)
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function lockThread(threadId: number) {
  return handleModerationAction(moderationController.lockThread(threadId))
}

export async function unlockThread(threadId: number) {
  return handleModerationAction(moderationController.unlockThread(threadId))
}

export async function pinThread(threadId: number) {
  return handleModerationAction(moderationController.pinThread(threadId))
}

export async function unpinThread(threadId: number) {
  return handleModerationAction(moderationController.unpinThread(threadId))
}

export async function deleteThread(threadId: number) {
  return handleModerationAction(moderationController.deleteThread(threadId))
}

export async function deleteReply(replyId: number) {
  return handleModerationAction(moderationController.deleteReply(replyId))
}

export async function resolveReport(reportId: number) {
  return handleModerationAction(moderationController.resolveReport(reportId, "moderator"))
}

export async function dismissReport(reportId: number) {
  return handleModerationAction(moderationController.dismissReport(reportId, "moderator"))
}

export async function createReport(contentType: "thread" | "reply", contentId: number, reason: string) {
  try {
    const reportId = await createReportUseCase.execute({
      contentType,
      contentId,
      reason,
    })
    return { success: true, reportId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create report" }
  }
}

export async function getPendingReports() {
  try {
    checkModeratorAuth()
    return await moderationController.getPendingReports()
  } catch (error) {
    console.error("Error fetching pending reports:", error)
    return []
  }
}

export async function getResolvedReports() {
  try {
    checkModeratorAuth()
    return await moderationController.getResolvedReports()
  } catch (error) {
    console.error("Error fetching resolved reports:", error)
    return []
  }
}

export async function banUser(ipAddress: string, reason?: string, durationHours?: number) {
  return handleModerationAction(moderationController.banUser(ipAddress, reason, durationHours))
}

export async function unbanUser(ipAddress: string) {
  return handleModerationAction(moderationController.unbanUser(ipAddress))
}

export async function markAsNsfw(contentType: "thread" | "reply", contentId: number) {
  return handleModerationAction(moderationController.markAsNsfw(contentType, contentId))
}

export async function getBans() {
  try {
    checkModeratorAuth()
    return await moderationController.getBans()
  } catch (error) {
    console.error("Error fetching bans:", error)
    return []
  }
}

export async function updateBan(id: number, reason?: string, durationHours?: number | null) {
  return handleModerationAction(moderationController.updateBan(id, reason, durationHours))
}
