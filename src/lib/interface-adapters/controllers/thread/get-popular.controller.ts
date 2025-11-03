import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const getPopular = async (limit: number) => {
  return threadModule.getPopularThreadsUseCase.execute(limit);
};
