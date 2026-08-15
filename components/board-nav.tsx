import { Suspense } from "react";
import { getBoardList } from "@/lib/actions/home.actions";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { NavControls } from "./nav-controls";
import { NavWrapper } from "./nav-wrapper";
import { HomeLink } from "./home-link";

import { BoardSwitcher } from "./board-switcher";

async function BoardListSection() {
  const boards = await getBoardList();
  return <BoardSwitcher boards={boards} />;
}

async function NavControlsSection() {
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  const { user } = sessionId
    ? await lucia.validateSession(sessionId)
    : { user: null };
  return <NavControls user={user} />;
}

export function BoardNav() {
  return (
    <NavWrapper>
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
          <span className="text-muted-foreground/50">[</span>
          {/* Home Link */}
          <HomeLink />
          <span className="text-muted-foreground/50 flex-shrink-0">/</span>

          <Suspense
            fallback={
              <span className="text-accent font-bold text-[10px] sm:text-[11px] opacity-50 animate-pulse">
                …
              </span>
            }
          >
            <BoardListSection />
          </Suspense>

          <span className="text-muted-foreground/50 flex-shrink-0">]</span>
        </div>

        <div className="flex items-center gap-1.5 pl-1.5 sm:pl-4 flex-shrink-0">
          <Suspense fallback={<div className="h-6 w-20" />}>
            <NavControlsSection />
          </Suspense>
        </div>
      </div>
    </NavWrapper>
  );
}
