import type { LockThreadUseCase } from "@/lib/use-cases/lock-thread.use-case"
import type { UnlockThreadUseCase } from "@/lib/use-cases/unlock-thread.use-case"
import type { PinThreadUseCase } from "@/lib/use-cases/pin-thread.use-case"
import type { UnpinThreadUseCase } from "@/lib/use-cases/unpin-thread.use-case"
import type { SoftDeleteThreadUseCase } from "@/lib/use-cases/soft-delete-thread.use-case"
import type { SoftDeleteReplyUseCase } from "@/lib/use-cases/soft-delete-reply.use-case"
import type { ResolveReportUseCase } from "@/lib/use-cases/resolve-report.use-case"
import type { DismissReportUseCase } from "@/lib/use-cases/dismiss-report.use-case"
import type { GetPendingReportsUseCase } from "@/lib/use-cases/get-pending-reports.use-case"
import type { GetResolvedReportsUseCase } from "@/lib/use-cases/get-resolved-reports.use-case"
import type { BanUserUseCase } from "@/lib/use-cases/ban-user.use-case"
import type { UnbanUserUseCase } from "@/lib/use-cases/unban-user.use-case"
import type { MarkNsfwUseCase } from "@/lib/use-cases/mark-nsfw.use-case"
import type { GetBansUseCase } from "@/lib/use-cases/get-bans.use-case"
import type { UpdateBanUseCase } from "@/lib/use-cases/update-ban.use-case"

export class ModerationController {
  constructor(
    private lockThreadUseCase: LockThreadUseCase,
    private unlockThreadUseCase: UnlockThreadUseCase,
    private pinThreadUseCase: PinThreadUseCase,
    private unpinThreadUseCase: UnpinThreadUseCase,
    private softDeleteThreadUseCase: SoftDeleteThreadUseCase,
    private softDeleteReplyUseCase: SoftDeleteReplyUseCase,
    private resolveReportUseCase: ResolveReportUseCase,
    private dismissReportUseCase: DismissReportUseCase,
    private getPendingReportsUseCase: GetPendingReportsUseCase,
    private getResolvedReportsUseCase: GetResolvedReportsUseCase,
    private banUserUseCase: BanUserUseCase,
    private unbanUserUseCase: UnbanUserUseCase,
    private markNsfwUseCase: MarkNsfwUseCase,
    private getBansUseCase: GetBansUseCase,
    private updateBanUseCase: UpdateBanUseCase,
  ) { }

  async lockThread(threadId: number) {
    // Input validation only
    if (!threadId) {
      throw new Error("Thread ID is required")
    }

    // Call use case
    await this.lockThreadUseCase.execute(threadId)
    return { success: true }
  }

  async unlockThread(threadId: number) {
    // Input validation only
    if (!threadId) {
      throw new Error("Thread ID is required")
    }

    // Call use case
    await this.unlockThreadUseCase.execute(threadId)
    return { success: true }
  }

  async pinThread(threadId: number) {
    // Input validation only
    if (!threadId) {
      throw new Error("Thread ID is required")
    }

    // Call use case
    await this.pinThreadUseCase.execute(threadId)
    return { success: true }
  }

  async unpinThread(threadId: number) {
    // Input validation only
    if (!threadId) {
      throw new Error("Thread ID is required")
    }

    // Call use case
    await this.unpinThreadUseCase.execute(threadId)
    return { success: true }
  }

  async deleteThread(threadId: number) {
    // Input validation only
    if (!threadId) {
      throw new Error("Thread ID is required")
    }

    // Call use case
    await this.softDeleteThreadUseCase.execute(threadId)
    return { success: true }
  }

  async deleteReply(replyId: number) {
    // Input validation only
    if (!replyId) {
      throw new Error("Reply ID is required")
    }

    // Call use case
    await this.softDeleteReplyUseCase.execute(replyId)
    return { success: true }
  }

  async resolveReport(reportId: number, resolvedBy: string) {
    // Input validation only
    if (!reportId) {
      throw new Error("Report ID is required")
    }

    // Call use case
    await this.resolveReportUseCase.execute(reportId, resolvedBy)
    return { success: true }
  }

  async dismissReport(reportId: number, resolvedBy: string) {
    // Input validation only
    if (!reportId) {
      throw new Error("Report ID is required")
    }

    // Call use case
    await this.dismissReportUseCase.execute(reportId, resolvedBy)
    return { success: true }
  }

  async getPendingReports() {
    // Call use case
    return await this.getPendingReportsUseCase.execute()
  }

  async getResolvedReports() {
    return await this.getResolvedReportsUseCase.execute()
  }

  async banUser(ipAddress: string, reason?: string, durationHours?: number) {
    if (!ipAddress) throw new Error("IP Address is required")
    await this.banUserUseCase.execute({ ipAddress, reason, durationHours })
    return { success: true }
  }

  async unbanUser(ipAddress: string) {
    if (!ipAddress) throw new Error("IP Address is required")
    await this.unbanUserUseCase.execute(ipAddress)
    return { success: true }
  }

  async markAsNsfw(contentType: "thread" | "reply", contentId: number) {
    if (!contentId) throw new Error("Content ID is required")
    await this.markNsfwUseCase.execute({ contentType, contentId })
    return { success: true }
  }

  async getBans() {
    return await this.getBansUseCase.execute()
  }

  async updateBan(id: number, reason?: string, durationHours?: number | null) {
    if (!id) throw new Error("Ban ID is required")
    await this.updateBanUseCase.execute({ id, reason, durationHours })
    return { success: true }
  }
}
