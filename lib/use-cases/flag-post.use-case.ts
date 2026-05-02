import type { ReportRepository } from "@/lib/repositories/report.repository"
import type { CreateReportInput } from "@/lib/entities/report.entity"

export class FlagPostUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(input: CreateReportInput): Promise<number> {
    // Business rule: Validate content type
    if (input.contentType !== "thread" && input.contentType !== "reply") {
      throw new Error("Invalid content type")
    }

    // Business rule: Validate reason
    if (!input.reason || input.reason.trim().length < 10) {
      throw new Error("Reason must be at least 10 characters")
    }

    if (input.reason.length > 500) {
      throw new Error("Reason is too long (max 500 characters)")
    }

    // Create report
    const report = await this.reportRepository.create({
      contentType: input.contentType,
      contentId: input.contentId,
      reason: input.reason.trim(),
    })

    return report.id
  }
}
