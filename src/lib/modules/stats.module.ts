import { GetTotalPostsUseCase } from "../application/use-cases/stats/get-stats.use-case";
import { StatsRepository } from "../infrastructure/repositories/stats.repository";

export class StatsModule {
  private statsRepository: StatsRepository;

  public getTotalPostsUseCase: GetTotalPostsUseCase;

  constructor() {
    this.statsRepository = new StatsRepository();
    this.getTotalPostsUseCase = new GetTotalPostsUseCase(this.statsRepository);
  }
}