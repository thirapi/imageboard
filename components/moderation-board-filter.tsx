"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Board {
  id: number;
  code: string;
  name: string;
}

interface ModerationBoardFilterProps {
  boards: Board[];
  selectedBoardCode?: string;
  baseUrl: string; // e.g., "/mod" or "/mod/history"
}

export function ModerationBoardFilter({
  boards,
  selectedBoardCode,
  baseUrl,
}: ModerationBoardFilterProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBoard = React.useMemo(
    () => boards.find((board) => board.code === selectedBoardCode),
    [boards, selectedBoardCode]
  );

  const onSelect = (code: string | null) => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (code) {
      params.set("board", code);
    } else {
      params.delete("board");
    }
    // Reset page when filter changes
    params.delete("page");
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Filter Board:</span>
        <div className="flex flex-wrap gap-1.5">
            <Button
              variant={!selectedBoardCode ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-3 text-[11px] rounded-full transition-all",
                !selectedBoardCode && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => onSelect(null)}
            >
              Semua
            </Button>
            
            {/* Quick access to some boards could go here if we wanted them pinned */}
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-[11px] rounded-full border-dashed flex items-center gap-1 hover:border-primary/50",
                    selectedBoardCode && "border-primary/50 text-primary"
                  )}
                >
                  <Search className="h-3 w-3 opacity-50" />
                  {selectedBoard ? `/${selectedBoard.code}/` : "Cari Board..."}
                  <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Ketik kode board (misal: /a/)..." />
                  <CommandList>
                    <CommandEmpty>Board tidak ditemukan.</CommandEmpty>
                    <CommandGroup heading="Daftar Board">
                      {boards.map((board) => (
                        <CommandItem
                          key={board.id}
                          value={board.code}
                          onSelect={() => onSelect(board.code)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="h-5 px-1 font-mono text-[10px]">
                               /{board.code}/
                             </Badge>
                             <span className="text-xs truncate max-w-[120px]">{board.name}</span>
                          </div>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedBoardCode === board.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedBoardCode && (
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelect(null)}
                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-destructive"
                title="Hapus Filter"
               >
                 <X className="h-3 w-3" />
               </Button>
            )}
        </div>
      </div>
    </div>
  );
}
