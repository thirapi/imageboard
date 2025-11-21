
import { ThreadModule } from "@/lib/modules/thread.module";
import { Thread } from "@/lib/types";

// We need to instantiate the module with media repository
// This will be a bit tricky because of how modules are instantiated.
// For now, let's assume we can get the media repository here.
// A better approach would be to use a proper DI container.
import { MediaRepository } from "@/lib/infrastructure/repositories/media.repository";

const threadModule = new ThreadModule();

// Manually inject MediaRepository for this controller
threadModule.createThreadUseCase['mediaRepository'] = new MediaRepository();

export const createThreadController = async (
  data: Thread,
  file?: { buffer: Buffer; fileName: string }
) => {
  return threadModule.createThreadUseCase.execute(data, file);
};
