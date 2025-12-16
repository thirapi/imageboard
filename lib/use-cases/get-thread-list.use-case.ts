import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"
import type { ThreadEntity } from "@/lib/entities/thread.entity"

export interface ThreadWithReplyCount extends ThreadEntity {
  replyCount: number
}

export class GetThreadListUseCase {
  constructor(
    private threadRepository: ThreadRepository,
    private replyRepository: ReplyRepository,
  ) {}

  async execute(boardId: number): Promise<ThreadWithReplyCount[]> {
    const threads = await this.threadRepository.findByBoardId(boardId)

    // Business logic: Attach reply counts to each thread
    const threadsWithCounts = await Promise.all(
      threads.map(async (thread) => {
        const replyCount = await this.replyRepository.countByThreadId(thread.id)
        return {
          ...thread,
          replyCount,
        }
      }),
    )

    return threadsWithCounts
  }
}
