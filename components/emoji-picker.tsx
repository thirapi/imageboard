"use client";

import { useState } from "react";
import { Smile, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CUSTOM_EMOJIS, SYSTEM_EMOJIS, CustomEmoji } from "@/constants/custom-emojis";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onSelect: (emojiTag: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"custom" | "system">("custom");
  const isMobile = useIsMobile();

  const filteredCustom = CUSTOM_EMOJIS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSystem = SYSTEM_EMOJIS.filter(
    (e) =>
      e.emoji.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCustom = (emoji: CustomEmoji) => {
    onSelect(`::${emoji.name}::`);
    setOpen(false);
  };

  const handleSelectSystem = (systemEmoji: { name: string; emoji: string }) => {
    onSelect(systemEmoji.emoji + " ");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-accent active:scale-95 transition-all rounded-md cursor-pointer flex items-center justify-center touch-manipulation"
          title="Pilih Emoji/GIF Kustom"
        >
          <Smile className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={isMobile ? "center" : "end"}
        side={isMobile ? "top" : "bottom"}
        sideOffset={6}
        className={cn(
          "p-2.5 space-y-2 z-50 border shadow-xl bg-popover/95 backdrop-blur-sm",
          isMobile
            ? "w-[92vw] max-w-[340px] rounded-xl"
            : "w-72 rounded-lg"
        )}
      >
        {/* Navigation Header */}
        <div className="flex items-center gap-1 p-0.5 bg-muted/40 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={cn(
              "flex-1 py-1 px-2 text-xs font-semibold rounded-md transition-all cursor-pointer text-center",
              activeTab === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Custom ({CUSTOM_EMOJIS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={cn(
              "flex-1 py-1 px-2 text-xs font-semibold rounded-md transition-all cursor-pointer text-center",
              activeTab === "system"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            System
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            placeholder={activeTab === "custom" ? "Cari custom GIF/emoji..." : "Cari unicode emoji..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 pr-2 text-xs bg-muted/20 border-muted/40 focus-visible:ring-accent rounded-md"
          />
        </div>

        {/* Content Body */}
        <div
          className={cn(
            "overflow-y-auto custom-scrollbar p-1 rounded-md bg-muted/10 border border-muted/20",
            isMobile ? "max-h-60" : "max-h-48"
          )}
        >
          {activeTab === "custom" ? (
            <div className="grid grid-cols-4 gap-1.5">
              {filteredCustom.map((emoji) => (
                <button
                  key={emoji.name}
                  type="button"
                  onClick={() => handleSelectCustom(emoji)}
                  className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-accent/15 active:scale-95 transition-all border border-transparent hover:border-accent/30 group cursor-pointer touch-manipulation"
                  title={`::${emoji.name}::`}
                >
                  <img
                    src={emoji.url}
                    alt={emoji.name}
                    className="h-9 w-9 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[9px] truncate w-full text-center mt-1 text-muted-foreground group-hover:text-foreground font-mono">
                    {emoji.name}
                  </span>
                </button>
              ))}
              {filteredCustom.length === 0 && (
                <div className="col-span-4 py-6 text-center text-xs text-muted-foreground italic">
                  Emoji custom tidak ditemukan
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1">
              {filteredSystem.map((sys) => (
                <button
                  key={sys.name}
                  type="button"
                  onClick={() => handleSelectSystem(sys)}
                  className="flex items-center justify-center p-2 rounded-md hover:bg-accent/15 active:scale-95 transition-all text-xl leading-none cursor-pointer touch-manipulation"
                  title={`:${sys.name}:`}
                >
                  {sys.emoji}
                </button>
              ))}
              {filteredSystem.length === 0 && (
                <div className="col-span-5 sm:col-span-6 py-6 text-center text-xs text-muted-foreground italic">
                  Unicode emoji tidak ditemukan
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
