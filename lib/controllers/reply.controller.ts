import type { ReplyToThreadUseCase } from "@/lib/use-cases/reply-to-thread.use-case"

export interface CreateReplyRequest {
  threadId: number
  content: string
  author?: string
  imageFile?: File | null
  deletionPassword?: string
  isNsfw?: boolean
  isSpoiler?: boolean
  ipAddress?: string
}

export class ReplyController {
  constructor(private replyToThreadUseCase: ReplyToThreadUseCase) { }

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
      deletionPassword: request.deletionPassword,
      isNsfw: request.isNsfw,
      isSpoiler: request.isSpoiler,
      ipAddress: request.ipAddress,
    })

    return { replyId }
  }
}
