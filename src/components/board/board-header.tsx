"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid3X3, List, Pin, Clock, MessageSquare, Plus } from "lucide-react"
import type { Board } from "@/lib/types"
import { NewThreadModal } from "@/components/modals/new-thread-modal"


interface BoardHeaderProps {
  board: Board;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortKey: string;
  setSortKey: (key: any) => void;
}

export function BoardHeader({
  board,
  viewMode,
  setViewMode,
  sortKey,
  setSortKey,
}: BoardHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <p className="text-muted-foreground mt-1">{board.description}</p>
          </div>
          <Badge variant="secondary" className="text-sm flex-shrink-0">
            {board.threadCount} threads
          </Badge>
        </div>

        <Card className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                title="Catalog view"
                className="flex-1 sm:flex-initial"
              >
                <Grid3X3 className="w-4 h-4 sm:mr-2" />
                <span className="inline">Catalog</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                title="List view"
                className="flex-1 sm:flex-initial"
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="inline">List</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastReply">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last Reply
                    </div>
                  </SelectItem>
                  <SelectItem value="createdAt">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4" />
                      Created
                    </div>
                  </SelectItem>
                  <SelectItem value="replyCount">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Replies
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <NewThreadModal
                boardId={board.id}
                boards={[board]}
                trigger={
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Thread</span>
                  </Button>
                }
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
