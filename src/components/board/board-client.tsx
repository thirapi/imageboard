"use client";

import { useState, useMemo } from "react";
import { BoardHeader } from "@/components/board/board-header";
import { ThreadGrid } from "@/components/board/thread-grid";
import type { Board, Thread } from "@/lib/types";

type SortKey = "lastReply" | "createdAt" | "replyCount";

interface BoardClientProps {
  board: Board;
  initialThreads: Thread[];
}

export function BoardClient({ board, initialThreads }: BoardClientProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortKey, setSortKey] = useState<SortKey>("lastReply");

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      if (sortKey === "createdAt" || sortKey === "lastReply") {
        const dateA = new Date(a[sortKey] ?? 0).getTime();
        const dateB = new Date(b[sortKey] ?? 0).getTime();
        return dateB - dateA; // Newest first
      }
      return (b[sortKey] ?? 0) - (a[sortKey] ?? 0); // Most replies first
    });
  }, [threads, sortKey]);

  return (
    <>
      <BoardHeader
        board={board}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortKey={sortKey}
        setSortKey={setSortKey}
      />
      <div className="container mx-auto px-4 py-6">
        <ThreadGrid threads={sortedThreads} viewMode={viewMode} />
      </div>
    </>
  );
}