"use server";

import { getAllBoardsController } from "@/lib/interface-adapters/controllers/board/get-all.controller";
import { getBoardByIdController } from "@/lib/interface-adapters/controllers/board/get-by-id.controller";

export async function getAllBoardsAction() {
  return getAllBoardsController();
}

export async function getBoardByIdAction(id: string) {
  return getBoardByIdController(id);
}
