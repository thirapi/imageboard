import type { ReplyToThreadUseCase } from "@/lib/use-cases/reply-to-thread.use-case"

export interface CreateReplyRequest {
  threadId: number
  content: string
  author?: string
  imageFile?: File | null
}

export class ReplyController {
  constructor(private replyToThreadUseCase: ReplyToThreadUseCase) {}

  async createReply(request: CreateReplyRequest) {
    // Input validation only
    if (!request.threadId) {
      throw new Error("Thread ID is required")
    }

    if (!request.content) {
      throw new Error("Content is required")
    }

    // Call use case
    const replyId = await this.replyToThreadUseCase.execute({
      threadId: request.threadId,
      content: request.content,
      author: request.author,
      imageFile: request.imageFile,
    })

    return { replyId }
  }
}
