import { CreateReplyUseCase } from "../application/use-cases/reply/create.use-case";
import { GetByThreadUseCase } from "../application/use-cases/reply/get-by-thread.use-case";
import { ReplyRepository } from "../infrastructure/repositories/reply.repository";
import { ThreadRepository } from "../infrastructure/repositories/thread.repository";
import { MediaService } from "../infrastructure/services/media.service";

export class ReplyModule {
    private replyRepository: ReplyRepository;
    private threadRepository: ThreadRepository;
    private mediaService: MediaService;

    public getRepliesByThreadUseCase: GetByThreadUseCase;
    public createReplyUseCase: CreateReplyUseCase;

    constructor() {
        this.replyRepository = new ReplyRepository();
        this.threadRepository = new ThreadRepository();
        this.mediaService = new MediaService();

        this.getRepliesByThreadUseCase = new GetByThreadUseCase(this.replyRepository);
        this.createReplyUseCase = new CreateReplyUseCase(this.replyRepository, this.threadRepository, this.mediaService);
    }
}