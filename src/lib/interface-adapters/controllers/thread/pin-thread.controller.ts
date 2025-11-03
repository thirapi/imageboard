import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const pinThreadController = async (id: string, isPinned: boolean) => {
  return threadModule.pinThreadUseCase.execute(id, isPinned);
};
