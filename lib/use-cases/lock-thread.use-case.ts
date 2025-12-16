import type { ThreadRepository } from "@/lib/repositories/thread.repository"

export class LockThreadUseCase {
  constructor(private threadRepository: ThreadRepository) {}

  async execute(threadId: number): Promise<void> {
    // Business rule: Validate thread exists
    const thread = await this.threadRepository.findById(threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    // Business rule: Cannot lock deleted threads
    if (thread.isDeleted) {
      throw new Error("Cannot lock deleted thread")
    }

    // Business rule: Lock the thread
    await this.threadRepository.updateLockStatus(threadId, true)
  }
}
