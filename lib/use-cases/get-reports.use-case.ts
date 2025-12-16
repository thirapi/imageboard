import type { ReportRepository } from "@/lib/repositories/report.repository"
import type { ReportEntity } from "@/lib/entities/report.entity"

export class GetReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(): Promise<ReportEntity[]> {
    const reports = await this.reportRepository.findAll()
    return reports
  }
}
