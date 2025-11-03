import { db } from "@/db";
import { replies } from "@/db/schema";
import { IReplyRepository } from "@/lib/application/repositories/reply.repository.interface";
import { Reply } from "@/lib/types";
import { eq } from "drizzle-orm";

export class ReplyRepository implements IReplyRepository {
  async getByThread(threadId: string): Promise<Reply[]> {
    const rows = await db
      .select()
      .from(replies)
      .where(eq(replies.threadId, threadId));
    return rows.map((r) => ({
      id: r.id,
      threadId: r.threadId,
      content: r.content,
      image: r.image ?? undefined,
      author: r.author,
      createdAt: r.createdAt,
      replyTo: r.replyTo ?? undefined,
    }));
  }

  async create(reply: Partial<Reply>): Promise<Reply> {
    const [result] = await db
      .insert(replies)
      .values({
        threadId: reply.threadId!,
        content: reply.content!,
        image: reply.image ?? null,
        author: reply.author ?? "Anonymous",
        createdAt: reply.createdAt ?? new Date(),
        replyTo: reply.replyTo ?? null,
      })
      .returning();

    return {
      id: result.id,
      threadId: result.threadId,
      content: result.content,
      image: result.image ?? undefined,
      author: result.author,
      createdAt: result.createdAt,
      replyTo: result.replyTo ?? undefined,
    };
  }
}
