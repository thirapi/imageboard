// src/lib/application/use-cases/thread/get-by-board.use-case.ts
import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { Thread } from "@/lib/types";

export class GetThreadsByBoardUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(boardId: string): Promise<Thread[]> {
    return this.threadRepository.getByBoard(boardId);
  }
}
