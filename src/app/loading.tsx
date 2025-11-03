import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { MessagesSquare, TrendingUp } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Header Skeleton */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-10/12 max-w-2xl mx-auto" />
          </div>

          {/* Boards Grid Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MessagesSquare className="w-6 h-6 text-muted-foreground animate-pulse" />
              <Skeleton className="h-7 w-64" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-10/12" />
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Threads Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-muted-foreground animate-pulse" />
              <Skeleton className="h-7 w-56" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-3 h-full">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
