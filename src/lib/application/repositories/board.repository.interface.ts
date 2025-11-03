import { Board } from "@/lib/types";

export interface IBoardRepository {
  getAll(): Promise<Board[]>;
  getById(id: string): Promise<Board | null>;
  create(board: Partial<Board>): Promise<Board>;
  incrementThreadCount(boardId: string): Promise<void>;
}
