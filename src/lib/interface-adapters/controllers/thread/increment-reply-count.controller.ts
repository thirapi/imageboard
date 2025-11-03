import { ThreadModule } from "@/lib/modules/thread.module";

const threadModule = new ThreadModule();

export const incrementThreadReplyCountController = async (id: string) => {
  return threadModule.incrementReplyCountUseCase.execute(id);
};
