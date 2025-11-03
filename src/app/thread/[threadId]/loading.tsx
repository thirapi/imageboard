import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ThreadLoading() {
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

      <main className="container mx-auto px-4 py-6">
        {/* Thread Title Skeleton */}
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/4 mb-6" />

        {/* Original Post Skeleton */}
        <Card className="mb-6">
          <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
            <div className="hidden sm:block">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </Card>

        {/* Replies Skeleton */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies</h2>
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                <div className="hidden sm:block">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
