import { IThreadRepository } from "../../repositories/thread.repository.interface";

export class SearchThreadsUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(query: string) {
    return this.threadRepository.search(query);
  }
}