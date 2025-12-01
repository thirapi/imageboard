import { Reply } from "@/lib/types";
import { IReplyRepository } from "../../repositories/reply.repository.interface";
import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { IMediaService } from "../../services/media.service.interface";

export class CreateReplyUseCase {
  constructor(
    private replyRepository: IReplyRepository,
    private threadRepository: IThreadRepository,
    private mediaService: IMediaService
  ) {}

  async execute(
    data: Partial<Reply>,
    file?: { buffer: Buffer; fileName: string }
  ) {
    if (!data.threadId || !data.content || !data.author) {
      throw new Error("Missing required fields for reply");
    }

    if (file) {
      const imageUrl = await this.mediaService.upload(
        file.buffer,
        file.fileName
      );
      data.image = imageUrl;
    }

    const reply = await this.replyRepository.create(data);

    await this.threadRepository.incrementReplyCount(data.threadId, new Date());

    return reply;
  }
}
