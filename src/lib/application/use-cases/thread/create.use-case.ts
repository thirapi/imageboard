import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { IBoardRepository } from "../../repositories/board.repository.interface"; 
import { Thread } from "@/lib/types";

export class CreateThreadUseCase {
  constructor(
    private threadRepository: IThreadRepository,
    private boardRepository: IBoardRepository
  ) {}

  async execute(data: Partial<Thread>): Promise<Thread> {
    if (!data.boardId || !data.title || !data.content || !data.author) {
      throw new Error("Missing required fields for thread");
    }

    const thread = await this.threadRepository.create(data);

    await this.boardRepository.incrementThreadCount(data.boardId);

    return thread;
  }
}
