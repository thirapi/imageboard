import Link from "next/link";
import { getBoardList } from "@/lib/actions/home.actions";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { logout } from "@/lib/actions/auth.actions";

import { ThemeToggle } from "./theme-toggle";
import { NavToggle } from "./nav-toggle";
import { NavWrapper } from "./nav-wrapper";

export async function BoardNav() {
  const boards = await getBoardList();
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  const { user } = sessionId
    ? await lucia.validateSession(sessionId)
    : { user: null };

  return (
    <NavWrapper>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <span>[</span>
        <Link href="/" className="px-0.5 hover:underline font-bold">
          Home
        </Link>
        <span className="mx-0.5">/</span>
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
        <NavToggle />
        <ThemeToggle />
        <Link href="/rules" className="hover:underline">
          [ Peraturan ]
        </Link>
        {user && (
          <>
            <Link href="/mod" className="hover:underline font-bold text-accent">
              [ Mod ]
            </Link>
            <form action={logout} className="inline">
              <button
                type="submit"
                className="hover:underline cursor-pointer text-inherit font-inherit"
              >
                [ Sign-out ]
              </button>
            </form>
          </>
        )}
      </div>
    </NavWrapper>
  );
}
