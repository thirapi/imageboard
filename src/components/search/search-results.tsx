"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreadCard } from "@/components/board/thread-card";
import { Search, Filter } from "lucide-react";
import { threads, boards } from "@/lib/dummy-data";
import { getAllBoardsAction } from "@/app/board.action";
import { searchThreadsAction } from "@/app/thread.action";
import { Board, Thread } from "@/lib/types";

interface SearchResultsProps {
  boards: Board[];
  threads: Thread[];
  query: string;
}

export function SearchResults({
  boards,
  threads: results,
  query,
}: SearchResultsProps) {
  const boardCounts = results.reduce((acc, thread) => {
    acc[thread.boardId] = (acc[thread.boardId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              {results.length} results for "{query}"
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {Object.keys(boardCounts).length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-3">Results by Board</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(boardCounts).map(([boardId, count]) => {
                const board = boards.find((b) => b.id === boardId);
                return (
                  <Badge key={boardId} variant="secondary" className="gap-1">
                    {board?.name} ({count})
                  </Badge>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any threads matching "{query}". Try:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Using different keywords</li>
            <li>• Checking your spelling</li>
            <li>• Using more general terms</li>
            <li>• Browsing boards directly</li>
          </ul>
        </Card>
      )}
    </div>
  );
}
