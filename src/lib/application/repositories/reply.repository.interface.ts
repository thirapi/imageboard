import { Reply } from "@/lib/types";

export interface IReplyRepository {
  getByThread(threadId: string): Promise<Reply[]>;
  create(reply: Partial<Reply>): Promise<Reply>;
}
