import { CommunityStats } from "@/lib/application/use-cases/stats/get-stats.use-case";
import { StatsModule } from "@/lib/modules/stats.module"

const statsModule = new StatsModule();

export const getTotalPostsController = async (): Promise<CommunityStats> => {
    return statsModule.getTotalPostsUseCase.execute();
}
    