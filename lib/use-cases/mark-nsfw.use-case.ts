import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ReplyRepository } from "@/lib/repositories/reply.repository"

export interface MarkNsfwCommand {
    contentType: "thread" | "reply"
    contentId: number
}

export class MarkNsfwUseCase {
    constructor(
        private threadRepository: ThreadRepository,
        private replyRepository: ReplyRepository
    ) { }

    async execute(command: MarkNsfwCommand): Promise<void> {
        if (command.contentType === "thread") {
            await this.threadRepository.updateNsfwStatus(command.contentId, true)
        } else {
            await this.replyRepository.updateNsfwStatus(command.contentId, true)
        }
    }
}
