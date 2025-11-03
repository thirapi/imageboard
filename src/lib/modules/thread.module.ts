// src/lib/application/modules/thread.module.ts

import { CreateThreadUseCase } from "../application/use-cases/thread/create.use-case";
import { GetThreadsByBoardUseCase } from "../application/use-cases/thread/get-by-board.use-case";
import { GetThreadByIdUseCase } from "../application/use-cases/thread/get-by-id.use-case";
import { GetPopularThreadsUseCase } from "../application/use-cases/thread/get-popular.use-case";
import { IncrementReplyCountUseCase } from "../application/use-cases/thread/increment-reply-count.use-case";
import { PinThreadUseCase } from "../application/use-cases/thread/pin-thread.use-case";
import { SearchThreadsUseCase } from "../application/use-cases/thread/search.use-case";
import { BoardRepository } from "../infrastructure/repositories/board.repository";
import { ThreadRepository } from "../infrastructure/repositories/thread.repository";

export class ThreadModule {
  private threadRepository: ThreadRepository;
  private boardRepository: BoardRepository;

  public getThreadsByBoardUseCase: GetThreadsByBoardUseCase;
  public getThreadByIdUseCase: GetThreadByIdUseCase;
  public createThreadUseCase: CreateThreadUseCase;
  public pinThreadUseCase: PinThreadUseCase;
  public incrementReplyCountUseCase: IncrementReplyCountUseCase;
  public getPopularThreadsUseCase: GetPopularThreadsUseCase;
  public searchThreadsUseCase: SearchThreadsUseCase;

  constructor() {
    this.threadRepository = new ThreadRepository();
    this.boardRepository = new BoardRepository();

    this.getThreadsByBoardUseCase = new GetThreadsByBoardUseCase(
      this.threadRepository
    );
    this.getThreadByIdUseCase = new GetThreadByIdUseCase(this.threadRepository);
    this.createThreadUseCase = new CreateThreadUseCase(
      this.threadRepository,
      this.boardRepository
    );
    this.pinThreadUseCase = new PinThreadUseCase(this.threadRepository);
    this.incrementReplyCountUseCase = new IncrementReplyCountUseCase(
      this.threadRepository
    );
    this.getPopularThreadsUseCase = new GetPopularThreadsUseCase(
      this.threadRepository
    );
    this.searchThreadsUseCase = new SearchThreadsUseCase(this.threadRepository);
  }
}
