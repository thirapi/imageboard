import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"
import type { ThreadEntity } from "@/lib/entities/thread.entity"
import { ReplyUI } from "@/lib/entities/reply.entity"

export interface ThreadWithReplyCount extends ThreadEntity {
  replyCount: number
  replies?: ReplyUI[]
}

export class GetThreadListUseCase {
  constructor(
    private threadRepository: ThreadRepository,
  ) { }

  async execute(boardId: number, limit: number = 50, offset: number = 0): Promise<ThreadWithReplyCount[]> {
    return await this.threadRepository.getThreadsWithPreviews(boardId, limit, offset)
  }
}
