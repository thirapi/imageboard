import type { ReportRepository } from "@/lib/repositories/report.repository"
import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"

interface ReportWithContent {
  id: number
  contentType: "thread" | "reply"
  contentId: number
  reason: string
  reportedAt: Date
  content: string
  author: string
}

export class GetPendingReportsUseCase {
  constructor(
    private reportRepository: ReportRepository,
    private threadRepository: ThreadRepository,
    private replyRepository: ReplyRepository,
  ) {}

  async execute(): Promise<ReportWithContent[]> {
    const reports = await this.reportRepository.findPending()

    const reportsWithContent = await Promise.all(
      reports.map(async (report) => {
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
          }
        }
      }),
    )

    return reportsWithContent
  }
}
