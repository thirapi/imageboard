import type { ThreadRepository } from "@/lib/repositories/thread.repository"

export class SoftDeleteThreadUseCase {
  constructor(private threadRepository: ThreadRepository) {}

  async execute(threadId: number): Promise<void> {
    // Business rule: Validate thread exists
    const thread = await this.threadRepository.findById(threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    // Business rule: Soft delete the thread
    await this.threadRepository.softDelete(threadId)
  }
}
