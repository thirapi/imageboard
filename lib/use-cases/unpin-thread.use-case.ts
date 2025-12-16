import type { ThreadRepository } from "@/lib/repositories/thread.repository"

export class UnpinThreadUseCase {
  constructor(private threadRepository: ThreadRepository) {}

  async execute(threadId: number): Promise<void> {
    // Business rule: Validate thread exists
    const thread = await this.threadRepository.findById(threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    // Business rule: Unpin the thread
    await this.threadRepository.updatePinStatus(threadId, false)
  }
}
