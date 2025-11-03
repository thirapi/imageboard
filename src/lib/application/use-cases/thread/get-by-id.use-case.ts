// src/lib/application/use-cases/thread/get-by-id.use-case.ts
import { IThreadRepository } from "../../repositories/thread.repository.interface";
import { Thread } from "@/lib/types";

export class GetThreadByIdUseCase {
  constructor(private threadRepository: IThreadRepository) {}

  async execute(id: string): Promise<Thread | null> {
    return this.threadRepository.getById(id);
  }
}
