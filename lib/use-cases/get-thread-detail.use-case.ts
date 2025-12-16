import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"
import type { ThreadEntity } from "@/lib/entities/thread.entity"
import type { ReplyEntity } from "@/lib/entities/reply.entity"

export interface ThreadDetail {
  thread: ThreadEntity
  replies: ReplyEntity[]
}

export class GetThreadDetailUseCase {
  constructor(
    private threadRepository: ThreadRepository,
    private replyRepository: ReplyRepository,
  ) {}

  async execute(threadId: number): Promise<ThreadDetail | null> {
    const thread = await this.threadRepository.findById(threadId)

    if (!thread) {
      return null
    }

    const replies = await this.replyRepository.findByThreadId(threadId)

    return {
      thread,
      replies,
    }
  }
}
