import { ReplyModule } from "@/lib/modules/reply.module";
import { Reply } from "@/lib/types";

const replyModule = new ReplyModule();

export const createReplyController = async (reply: Partial<Reply>) => {
  return replyModule.createReplyUseCase.execute(reply);
};
