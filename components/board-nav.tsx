import Link from "next/link";
import { getBoardList } from "@/lib/actions/home.actions";

export async function BoardNav() {
  const boards = await getBoardList();

  return (
    <nav className="border-b bg-muted/30 py-1 px-4 text-[11px] font-mono flex items-center justify-between">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <span>[</span>
        {boards.map((board, index) => (
          <span key={board.code}>
            <Link
              href={`/${board.code}`}
              className="px-0.5 hover:underline text-accent"
              title={board.name}
            >
              {board.code}
            </Link>
            {index < boards.length - 1 && <span className="mx-0.5">/</span>}
          </span>
        ))}
        <span>]</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/mod" className="hover:underline">
          Mod
        </Link>
      </div>
    </nav>
  );
}
