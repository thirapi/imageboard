
"use server";

import { createThreadController } from "@/lib/interface-adapters/controllers/thread/create.controller";
import { getThreadByBoardController } from "@/lib/interface-adapters/controllers/thread/get-by-board.controller";
import { getThreadByIdController } from "@/lib/interface-adapters/controllers/thread/get-by-id.controller";
import { getPopular } from "@/lib/interface-adapters/controllers/thread/get-popular.controller";
import { incrementThreadReplyCountController } from "@/lib/interface-adapters/controllers/thread/increment-reply-count.controller";
import { pinThreadController } from "@/lib/interface-adapters/controllers/thread/pin-thread.controller";
import { searchThreadsController } from "@/lib/interface-adapters/controllers/thread/search.controller";
import { Thread } from "@/lib/types";

export async function getThreadsByBoardAction(boardId: string) {
  return getThreadByBoardController(boardId);
}

export async function getThreadByIdAction(id: string) {
  return getThreadByIdController(id);
}

export async function createThreadAction(formData: FormData) {
  const data = {
    boardId: formData.get("boardId") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
  } as Thread;

  const image = formData.get("image") as File;
  let file: { buffer: Buffer; fileName: string } | undefined;

  if (image) {
    const buffer = await image.arrayBuffer();
    file = {
      buffer: Buffer.from(buffer),
      fileName: image.name,
    };
  }

  return createThreadController(data, file);
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
