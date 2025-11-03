"use server";

import { createThreadController } from "@/lib/interface-adapters/controllers/thread/create.controller";
import { getThreadByBoardController } from "@/lib/interface-adapters/controllers/thread/get-by-board.controller";
import { getThreadByIdController } from "@/lib/interface-adapters/controllers/thread/get-by-id.controller";
import { getPopular } from "@/lib/interface-adapters/controllers/thread/get-popular.controller";
import { incrementThreadReplyCountController } from "@/lib/interface-adapters/controllers/thread/increment-reply-count.controller";
import { pinThreadController } from "@/lib/interface-adapters/controllers/thread/pin-thread.controller";
import { searchThreadsController } from "@/lib/interface-adapters/controllers/thread/search.controller";

export async function getThreadsByBoardAction(boardId: string) {
  return getThreadByBoardController(boardId);
}

export async function getThreadByIdAction(id: string) {
  return getThreadByIdController(id);
}

export async function createThreadAction(data: any) {
  return createThreadController(data);
}

export async function pinThreadAction(id: string, isPinned: boolean) {
  return pinThreadController(id, isPinned);
}

export async function incrementThreadReplyCountAction(id: string) {
  return incrementThreadReplyCountController(id);
}

export async function getPopularThreadsAction(limit: number) {
  return getPopular(limit);
}

export async function searchThreadsAction(query: string) {
  return searchThreadsController(query);
}
