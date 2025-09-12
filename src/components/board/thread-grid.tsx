"use client"

import { useState } from "react"
import { ThreadCard } from "./thread-card"
import { ThreadListItem } from "./thread-list-item"
import type { Thread } from "@/lib/types"

interface ThreadGridProps {
  threads: Thread[]
}

export function ThreadGrid({ threads }: ThreadGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {threads.map((thread) => (
          <ThreadListItem key={thread.id} thread={thread} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  )
}
