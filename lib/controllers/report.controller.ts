import type { GetReportsUseCase } from "@/lib/use-cases/get-reports.use-case"
import type { ReportRepository } from "@/lib/repositories/report.repository"

export class ReportController {
  constructor(
    private reportRepository: ReportRepository,
    private getReportsUseCase: GetReportsUseCase,
  ) {}

  async getReports() {
    try {
      const reports = await this.getReportsUseCase.execute()
      return { success: true, data: reports }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch reports",
      }
    }
  }
}
