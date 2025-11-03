import { CreateUseCase } from "../application/use-cases/reply/create.use-case";
import { GetByThreadUseCase } from "../application/use-cases/reply/get-by-thread.use-case";
import { ReplyRepository } from "../infrastructure/repositories/reply.repository";
import { ThreadRepository } from "../infrastructure/repositories/thread.repository";

export class ReplyModule {
    private replyRepository: ReplyRepository;
    private threadRepository: ThreadRepository;

    public getRepliesByThreadUseCase: GetByThreadUseCase;
    public createReplyUseCase: CreateUseCase;

    constructor() {
        this.replyRepository = new ReplyRepository();
        this.threadRepository = new ThreadRepository();

        this.getRepliesByThreadUseCase = new GetByThreadUseCase(this.replyRepository);
        this.createReplyUseCase = new CreateUseCase(this.replyRepository, this.threadRepository);
    }
}