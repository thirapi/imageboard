import type { ReplyRepository } from "@/lib/repositories/reply.repository"

export class SoftDeleteReplyUseCase {
  constructor(private replyRepository: ReplyRepository) {}

  async execute(replyId: number): Promise<void> {
    // Business rule: Soft delete the reply
    await this.replyRepository.softDelete(replyId)
  }
}
