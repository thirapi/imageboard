import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const searchThreadsController = async (query: string) => {
  return threadModule.searchThreadsUseCase.execute(query);
};
