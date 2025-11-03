import { Reply } from "@/lib/types";
import { IReplyRepository } from "../../repositories/reply.repository.interface";
import { IThreadRepository } from "../../repositories/thread.repository.interface";

export class CreateUseCase {
  constructor(
    private replyRepository: IReplyRepository,
    private threadRepository: IThreadRepository
  ) {}

  async execute(data: Partial<Reply>) {
    if (!data.threadId || !data.content || !data.author) {
      throw new Error("Missing required fields for reply");
    }

    const reply = await this.replyRepository.create(data);

    await this.threadRepository.incrementReplyCount(data.threadId, new Date());

    return reply;
  }
}
