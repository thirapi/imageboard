import type { ReportRepository } from "@/lib/repositories/report.repository"
import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"
import type { BanRepository } from "@/lib/repositories/ban.repository"

interface ReportWithContent {
  id: number
  contentType: "thread" | "reply"
  contentId: number
  reason: string
  reportedAt: Date
  content: string
  author: string
  ipAddress?: string | null
  status: string
  isLocked?: boolean
  isPinned?: boolean
  isBanned?: boolean
}

export class GetPendingReportsUseCase {
  constructor(
    private reportRepository: ReportRepository,
    private threadRepository: ThreadRepository,
    private replyRepository: ReplyRepository,
    private banRepository: BanRepository,
  ) { }

  async execute(): Promise<ReportWithContent[]> {
    const reports = await this.reportRepository.findPending()

    const reportsWithContent = await Promise.all(
      reports.map(async (report) => {
        const ipAddress = report.contentType === "thread"
          ? (await this.threadRepository.findById(report.contentId))?.ipAddress
          : (await this.replyRepository.findById(report.contentId))?.ipAddress

        let isBanned = false
        if (ipAddress) {
          const ban = await this.banRepository.findByIp(ipAddress)
          isBanned = !!ban
        }

        if (report.contentType === "thread") {
          const thread = await this.threadRepository.findById(report.contentId)
          return {
            id: report.id,
            contentType: report.contentType,
            contentId: report.contentId,
            reason: report.reason,
            reportedAt: report.reportedAt,
            content: thread?.content || "[Deleted]",
            author: thread?.author || "Unknown",
            ipAddress: thread?.ipAddress,
            status: report.status,
            isLocked: thread?.isLocked,
            isPinned: thread?.isPinned,
            isBanned,
          }
        } else {
          const reply = await this.replyRepository.findById(report.contentId)
          return {
            id: report.id,
            contentType: report.contentType,
            contentId: report.contentId,
            reason: report.reason,
            reportedAt: report.reportedAt,
            content: reply?.content || "[Deleted]",
            author: reply?.author || "Unknown",
            ipAddress: reply?.ipAddress,
            status: report.status,
            isBanned,
          }
        }
      }),
    )

    return reportsWithContent
  }
}
