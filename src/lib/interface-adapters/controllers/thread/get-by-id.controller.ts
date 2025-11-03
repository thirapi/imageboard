import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const getThreadByIdController = async (id: string) => {
  return threadModule.getThreadByIdUseCase.execute(id);
};
