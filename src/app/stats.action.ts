"use server";

import { getTotalPostsController } from "@/lib/interface-adapters/controllers/stats/get-total-post.controller";

export async function getTotalPostsAction() {
  return getTotalPostsController();
}
