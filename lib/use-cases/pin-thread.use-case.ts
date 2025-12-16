import type { ThreadRepository } from "@/lib/repositories/thread.repository"

export class PinThreadUseCase {
  constructor(private threadRepository: ThreadRepository) {}

  async execute(threadId: number): Promise<void> {
    // Business rule: Validate thread exists
    const thread = await this.threadRepository.findById(threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    // Business rule: Cannot pin deleted threads
    if (thread.isDeleted) {
      throw new Error("Cannot pin deleted thread")
    }

    // Business rule: Pin the thread
    await this.threadRepository.updatePinStatus(threadId, true)
  }
}
