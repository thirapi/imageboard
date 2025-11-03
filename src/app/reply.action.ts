"use server";

import { createReplyController } from "@/lib/interface-adapters/controllers/reply/create.controller";
import { getRepliesByThreadController } from "@/lib/interface-adapters/controllers/reply/get-by-thread.controller";
import { Reply } from "@/lib/types";

export async function getRepliesByThreadAction(threadId: string) {
  return getRepliesByThreadController(threadId);
}

export async function createRepliesAction(reply: Partial<Reply>) {
  return createReplyController(reply);
}
