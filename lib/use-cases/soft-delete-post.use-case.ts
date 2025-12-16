import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"

export class SoftDeletePostUseCase {
  constructor(
    private threadRepository: ThreadRepository,
    private replyRepository: ReplyRepository,
  ) {}

  async execute(contentType: "thread" | "reply", contentId: number): Promise<void> {
    // Business rule: Validate content type
    if (contentType !== "thread" && contentType !== "reply") {
      throw new Error("Invalid content type")
    }

    if (contentType === "thread") {
      await this.threadRepository.softDelete(contentId)
    } else {
      await this.replyRepository.softDelete(contentId)
    }
  }
}
