import { getBoardCategories } from "@/lib/actions/board.actions";
import { BoardForm } from "@/components/mod/board-form";

export default async function NewBoardPage() {
  const categories = await getBoardCategories();

  return <BoardForm categories={categories} mode="create" />;
}
