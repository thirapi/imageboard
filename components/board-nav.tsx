import Link from "next/link";
import { getBoardList } from "@/lib/actions/home.actions";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { logout } from "@/lib/actions/auth.actions";

import { ThemeToggle } from "./theme-toggle";

export async function BoardNav() {
  const boards = await getBoardList();
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  const { user } = sessionId
    ? await lucia.validateSession(sessionId)
    : { user: null };

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
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/rules" className="hover:underline">
          Peraturan
        </Link>
        {user && (
          <>
            <Link href="/mod" className="hover:underline font-bold text-accent">
              Mod
            </Link>
            <form action={logout} className="inline">
              <button type="submit" className="hover:underline cursor-pointer">
                Sign-out
              </button>
            </form>
          </>
        )}
      </div>
    </nav>
  );
}
