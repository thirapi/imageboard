import type { ReportRepository } from "@/lib/repositories/report.repository"

export class DismissReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(reportId: number, resolvedBy = "moderator"): Promise<void> {
    // Business rule: Mark report as dismissed
    await this.reportRepository.updateStatus(reportId, "dismissed", resolvedBy)
  }
}
