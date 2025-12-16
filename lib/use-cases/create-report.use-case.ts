import type { ReportRepository } from "@/lib/repositories/report.repository"
import type { CreateReportInput } from "@/lib/entities/report.entity"

export class CreateReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(input: CreateReportInput): Promise<number> {
    // Business rule: Validate reason is not empty
    if (!input.reason || input.reason.trim().length < 1) {
      throw new Error("Report reason cannot be empty")
    }

    // Business rule: Validate reason length
    if (input.reason.length > 500) {
      throw new Error("Report reason is too long (max 500 characters)")
    }

    // Create report
    const report = await this.reportRepository.create(input)
    return report.id
  }
}
