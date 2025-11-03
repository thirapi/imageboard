// src/lib/application/use-cases/thread/pin-thread.use-case.ts
import { IThreadRepository } from "../../repositories/thread.repository.interface";

export class PinThreadUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(threadId: string, isPinned: boolean): Promise<void> {
    return this.threadRepository.pinThread(threadId, isPinned);
  }
}
