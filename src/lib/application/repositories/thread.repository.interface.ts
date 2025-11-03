import { Thread } from "@/lib/types";

export interface IThreadRepository {
  getByBoard(boardId: string): Promise<Thread[]>;
  getById(id: string): Promise<Thread | null>;
  create(thread: Partial<Thread>): Promise<Thread>;
  incrementReplyCount(threadId: string, lastReply?: Date): Promise<void>;
  pinThread(threadId: string, isPinned: boolean): Promise<void>;
  getPopular(limit: number): Promise<Thread[]>;
  search(query: string): Promise<Thread[]>;
}
