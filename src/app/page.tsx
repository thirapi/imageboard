import { MainHeader } from "@/components/layout/main-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageSquare,
  Users,
  HardDrive,
  Clock,
  Pin,
  MessagesSquare,
} from "lucide-react";
import { threads, replies } from "@/lib/dummy-data";
import Link from "next/link";
import { getAllBoardsAction } from "./board.action";
import { getPopularThreadsAction } from "./thread.action";
import { getTotalPostsAction } from "./stats.action";

export default async function HomePage() {
  const boards = await getAllBoardsAction();

  const popularThreads = await getPopularThreadsAction(5);

  const totalPosts = await getTotalPostsAction();
  // const totalPosts = threads.length + replies.length;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader boards={boards} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Imageboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, anonymous discussion platform. Choose a board below to
              start browsing threads and join the conversation.
            </p>
          </div>

          {/* Boards Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MessagesSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Discussion Boards</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`}>
                  <Card className="p-6 hover:bg-accent transition-all duration-200 cursor-pointer h-full group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                          {board.name}
                        </h3>
                        <Badge variant="secondary" className="shrink-0">
                          {board.threadCount} threads
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {board.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Threads */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Popular Threads</h2>
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
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">
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

          {/* Stats Section */}
          {/* <div className="border-t pt-8">
            <h3 className="text-lg font-medium text-center mb-4 text-muted-foreground">
              Community Stats
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Total Posts:</span>
                <span className="font-semibold">
                  {totalPosts.totalPosts}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Current Users:</span>
                <span className="font-semibold">225,951</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Active Content:</span>
                <span className="font-semibold">1,068 GB</span>
              </div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}
