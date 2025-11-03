export interface IStatsRepository {
  getTotalThreads(): Promise<number>;
  getTotalReplies(): Promise<number>;
}
