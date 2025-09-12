import { Suspense } from "react"
import { MainHeader } from "@/components/layout/main-header"
import { SearchResults } from "@/components/search/search-results"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<div className="p-6">Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  )
}
