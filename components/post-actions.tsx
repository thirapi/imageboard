"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeletePostButton } from "./delete-post-button";
import { ReportButton } from "./report-button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: number;
  postType: "thread" | "reply";
  boardCode: string;
  onHide: () => void;
  className?: string;
  isOP?: boolean;
}

export function PostActions({
  postId,
  postType,
  boardCode,
  onHide,
  className,
  isOP = false,
}: PostActionsProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("inline-flex items-center ml-1", className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "p-0 transition-all text-xs leading-none text-muted-foreground/60 hover:text-accent font-serif cursor-pointer",
              isOpen && "text-accent rotate-90"
            )}
            title="Opsi Postingan"
          >
            <span className="inline-block transform origin-center translate-y-[-1px]">▶</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36 rounded-sm border-muted/30 shadow-sm">
          <DropdownMenuItem onClick={onHide} className="cursor-pointer text-xs py-1">
            Sembunyikan
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-0.5 opacity-50" />
          
          <DropdownMenuItem 
            onClick={() => setShowReport(true)} 
            className="cursor-pointer text-xs py-1"
          >
            Laporkan
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setShowDelete(true)} 
            className="cursor-pointer text-xs py-1 text-destructive focus:text-destructive"
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Triggers (Hidden) */}
      <div className="hidden">
        {showDelete && (
          <DeletePostButton 
            postId={postId} 
            postType={postType} 
            boardCode={boardCode} 
            open={showDelete}
            onOpenChange={setShowDelete}
            trigger={null}
          />
        )}
        {showReport && (
          <ReportButton 
            contentType={postType} 
            contentId={postId} 
            open={showReport}
            onOpenChange={setShowReport}
            trigger={null}
          />
        )}
      </div>
    </div>
  );
}
