import { IStatsRepository } from "../../repositories/stats.repository.interface";

export interface CommunityStats {
  totalThreads: number;
  totalReplies: number;
  totalPosts: number;
}

export class GetTotalPostsUseCase {
  constructor(private statsRepository: IStatsRepository) {}

  async execute(): Promise<CommunityStats> {
    const [threads, replies] = await Promise.all([
      this.statsRepository.getTotalThreads(),
      this.statsRepository.getTotalReplies(),
    ]);

    return {
      totalThreads: threads,
      totalReplies: replies,
      totalPosts: threads + replies,
    };
  }
}
