
import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { IBoardRepository } from "../../repositories/board.repository.interface";
import { IMediaService } from "../../services/media.service.interface";
import { Thread } from "@/lib/types";

export class CreateThreadUseCase {
  constructor(
    private threadRepository: IThreadRepository,
    private boardRepository: IBoardRepository,
    private mediaService: IMediaService
  ) {}

  async execute(
    data: Partial<Thread>,
    file?: { buffer: Buffer; fileName: string }
  ): Promise<Thread> {
    if (!data.boardId || !data.title || !data.content || !data.author) {
      throw new Error("Missing required fields for thread");
    }

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.mediaService.upload(file.buffer, file.fileName);
    }

    const threadData = {
      ...data,
      image: imageUrl,
    };

    const thread = await this.threadRepository.create(threadData);

    await this.boardRepository.incrementThreadCount(data.boardId);

    return thread;
  }
}
