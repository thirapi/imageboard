"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid3X3, List, Pin, Clock, MessageSquare } from "lucide-react"
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
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <p className="text-muted-foreground">{board.description}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {board.threadCount} threads
          </Badge>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Catalog
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="w-40">
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

              <NewThreadModal boardId={board.id} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
