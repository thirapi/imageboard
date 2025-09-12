"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Plus, Home } from "lucide-react"
import { boards, threads } from "@/lib/dummy-data"
import { ModeToggle } from "@/components/mode-toggle"
import { NewThreadModal } from "@/components/modals/new-thread-modal"
import { SearchModal } from "@/components/modals/search-modal"

export function MainHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const getCurrentBoard = () => {
    // Check if we're on a board page
    const boardMatch = pathname.match(/^\/board\/(.+)$/)
    if (boardMatch) {
      return boards.find((board) => board.id === boardMatch[1])
    }

    // Check if we're on a thread page
    const threadMatch = pathname.match(/^\/thread\/(.+)$/)
    if (threadMatch) {
      const thread = threads.find((thread) => thread.id === threadMatch[1])
      if (thread) {
        return boards.find((board) => board.id === thread.boardId)
      }
    }

    return null
  }

  const currentBoard = getCurrentBoard()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IB</span>
            </div>
            <span className="font-bold text-xl">Imageboard</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3 flex-1 justify-end max-w-2xl">
            {/* Board Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent min-w-0 flex-shrink-0">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-32">
                    {currentBoard ? currentBoard.name : "All Boards"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Navigate to Board</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    All Boards
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {boards.map((board) => (
                  <DropdownMenuItem key={board.id} asChild>
                    <Link href={`/board/${board.id}`} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{board.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{board.description}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {board.threadCount}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden bg-transparent"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>

              <NewThreadModal
                trigger={
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Thread</span>
                  </Button>
                }
              />
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <SearchModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </>
  )
}
