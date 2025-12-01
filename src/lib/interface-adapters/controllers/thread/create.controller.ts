
import { ThreadModule } from "@/lib/modules/thread.module";
import { Thread } from "@/lib/types";
import { MediaService } from "@/lib/infrastructure/services/media.service";

const threadModule = new ThreadModule();

// Manually inject MediaService for this controller
threadModule.createThreadUseCase['mediaService'] = new MediaService();

export const createThreadController = async (
  data: Thread,
  file?: { buffer: Buffer; fileName: string }
) => {
  return threadModule.createThreadUseCase.execute(data, file);
};
