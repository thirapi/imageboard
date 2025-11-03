import { ReplyModule } from "@/lib/modules/reply.module";

const replyModule = new ReplyModule();

export const getRepliesByThreadController = async (threadId: string) => {
  return replyModule.getRepliesByThreadUseCase.execute(threadId);
}