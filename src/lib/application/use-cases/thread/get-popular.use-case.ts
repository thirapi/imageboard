import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { Thread } from "@/lib/types";

export class GetPopularThreadsUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(limit: number): Promise<Thread[]> {
    return this.threadRepository.getPopular(limit);
  }
}