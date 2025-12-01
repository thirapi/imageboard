"use server";

import { createReplyController } from "@/lib/interface-adapters/controllers/reply/create.controller";
import { getRepliesByThreadController } from "@/lib/interface-adapters/controllers/reply/get-by-thread.controller";
import { revalidatePath } from "next/cache";

export async function getRepliesByThreadAction(threadId: string) {
  return getRepliesByThreadController(threadId);
}

export async function createRepliesAction(formData: FormData) {
  const response = await createReplyController(formData);
  revalidatePath(`/thread/${formData.get("threadId")}`);
  return response;
}
