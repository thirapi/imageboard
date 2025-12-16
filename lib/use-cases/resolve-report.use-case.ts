import type { ReportRepository } from "@/lib/repositories/report.repository"

export class ResolveReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(reportId: number, resolvedBy = "moderator"): Promise<void> {
    // Business rule: Mark report as resolved
    await this.reportRepository.updateStatus(reportId, "resolved", resolvedBy)
  }
}
