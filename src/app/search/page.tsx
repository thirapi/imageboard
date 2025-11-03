import { Suspense } from "react";
import { MainHeader } from "@/components/layout/main-header";
import { SearchResults } from "@/components/search/search-results";
import { getAllBoardsAction } from "../board.action";
import { searchThreadsAction } from "../thread.action";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const boards = await getAllBoardsAction();
  const threads = query ? await searchThreadsAction(query) : [];

  return (
    <div className="min-h-screen bg-background">
      <MainHeader boards={boards} />
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<div className="p-6">Loading search results...</div>}>
          <SearchResults boards={boards} threads={threads} query={query} />
        </Suspense>
      </main>
    </div>
  );
}
