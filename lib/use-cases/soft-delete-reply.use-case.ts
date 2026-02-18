import type { ReplyRepository } from "@/lib/repositories/reply.repository"

export class SoftDeleteReplyUseCase {
  constructor(private replyRepository: ReplyRepository) { }

  async execute(replyId: number): Promise<any> {
    const reply = await this.replyRepository.findById(replyId)
    if (!reply) {
      throw new Error("Reply not found")
    }

    // Business rule: Soft delete the reply
    await this.replyRepository.softDelete(replyId)
    return reply
  }
}
