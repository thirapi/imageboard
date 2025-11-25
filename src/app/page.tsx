import { MainHeader } from "@/components/layout/main-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageSquare,
  Clock,
  Pin,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { getAllBoardsAction } from "./board.action";
import { getPopularThreadsAction } from "./thread.action";
import { getTotalPostsAction } from "./stats.action";
import { Footer } from "@/components/layout/footer";
import { EditableHero } from "@/components/layout/editable-hero";

export const revalidate = 60; // Revalidate at most every 60 seconds

export default async function HomePage() {
  const boards = await getAllBoardsAction();

  const popularThreads = await getPopularThreadsAction(5);

  await getTotalPostsAction();

  return (
    <>
      <MainHeader boards={boards} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="relative z-10 text-center space-y-6">
            <EditableHero badge={"Imageboard"} heading={"The Imageboard Discussion Platform"} description={`An imageboard (informally known as an image-based bulletin board) is a type of online forum in
              which users post images and text to start or contribute to discussion threads. The format prioritizes
              anonymity, chronological surfacing, and topic-driven boards.`} boards={boards} popularThreads={popularThreads} />
          </div>

          {/* Boards Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MessagesSquare className="w-6 h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold">Discussion Boards</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`}>
                  <Card className="p-6 hover:bg-accent transition-all duration-200 cursor-pointer h-full group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg md:text-xl group-hover:text-primary transition-colors">
                          {board.name}
                        </h3>
                        <Badge variant="secondary" className="shrink-0">
                          {board.threadCount} threads
                        </Badge>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {board.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Threads */}
          {popularThreads.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl md:text-2xl font-semibold">Popular Threads</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {popularThreads.map((thread) => {
                  const board = boards.find((b) => b.id === thread.boardId);
                  return (
                    <Link key={thread.id} href={`/thread/${thread.id}`}>
                      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer h-full">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            {thread.isPinned && (
                              <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            )}
                            <h3 className="font-medium text-sm md:text-base leading-tight line-clamp-2">
                              {thread.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{board?.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {thread.replyCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {thread.lastReply?.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
