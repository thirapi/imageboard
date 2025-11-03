import { IReplyRepository } from "../../repositories/reply.repository.interface";

export class GetByThreadUseCase {
  constructor(private replyRepository: IReplyRepository) {}

  async execute(threadId: string) {
    return this.replyRepository.getByThread(threadId);
  }
}
