// src/lib/application/use-cases/thread/increment-reply-count.use-case.ts
import { IThreadRepository } from "../../repositories/thread.repository.interface";

export class IncrementReplyCountUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(threadId: string, lastReply?: Date): Promise<void> {
    return this.threadRepository.incrementReplyCount(threadId, lastReply);
  }
}
