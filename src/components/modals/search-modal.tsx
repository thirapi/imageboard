"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Clock, MessageSquare, TrendingUp } from "lucide-react"
import { threads, boards } from "@/lib/dummy-data"
import { formatDistanceToNow } from "date-fns"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof threads>([])
  const router = useRouter()

  const recentSearches = ["JavaScript tutorial", "anime recommendations", "Linux setup"]
  const trendingTopics = ["programming", "gaming", "anime", "technology"]

  useEffect(() => {
    if (query.trim()) {
      const filtered = threads.filter(
        (thread) =>
          thread.title.toLowerCase().includes(query.toLowerCase()) ||
          thread.content.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      onOpenChange(false)
      setQuery("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Threads</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for threads, topics, or keywords..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {query.trim() && results.length > 0 && (
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
                {results.map((thread) => {
                  const board = boards.find((b) => b.id === thread.boardId)
                  return (
                    <div
                      key={thread.id}
                      className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => {
                        router.push(`/thread/${thread.id}`)
                        onOpenChange(false)
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {board?.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm line-clamp-1">{thread.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{thread.content}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replyCount}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}

          {!query.trim() && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(topic)}
                      className="text-xs"
                    >
                      #{topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No threads found for "{query}"</p>
              <p className="text-sm">Try different keywords or browse boards directly</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
