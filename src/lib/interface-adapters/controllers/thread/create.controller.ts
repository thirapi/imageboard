import { ThreadModule } from "@/lib/modules/thread.module";
import { Thread } from "@/lib/types";

const threadModule = new ThreadModule();

export const createThreadController = async (data: Thread) => {
  return threadModule.createThreadUseCase.execute(data);
};
