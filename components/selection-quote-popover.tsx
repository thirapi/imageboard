"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

interface SelectionQuotePopoverProps {
  onQuote: (postNumber: number, selectedText: string) => void;
}

export function SelectionQuotePopover({ onQuote }: SelectionQuotePopoverProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectionData, setSelectionData] = useState<{ postNumber: number; text: string } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null);
        setSelectionData(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length === 0) {
        setPosition(null);
        return;
      }

      // Find the parent post container (#p1234)
      let node: Node | null = selection.anchorNode;
      let postElement: HTMLElement | null = null;

      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.id && /^p\d+$/.test(el.id)) {
            postElement = el;
            break;
          }
        }
        node = node.parentNode;
      }

      if (!postElement) {
        setPosition(null);
        return;
      }

      // Validate that both selection boundaries are inside the SAME content block
      const getContentElement = (n: Node | null): HTMLElement | null => {
        if (!n) return null;
        let el: HTMLElement | null = n.nodeType === Node.TEXT_NODE ? (n.parentElement as HTMLElement) : (n as HTMLElement);
        while (el) {
          if (el.getAttribute && el.getAttribute("data-post-content") === "true") return el;
          if (el.id && /^p\d+$/.test(el.id)) break;
          el = el.parentElement;
        }
        return null;
      };

      const anchorContent = getContentElement(selection.anchorNode);
      const focusContent = getContentElement(selection.focusNode);

      if (!anchorContent || !focusContent || anchorContent !== focusContent) {
        setPosition(null);
        return;
      }

      const postNumberStr = postElement.id.replace("p", "");
      const postNumber = parseInt(postNumberStr, 10);

      if (isNaN(postNumber)) {
        setPosition(null);
        return;
      }

      // On mobile, the selection might not be ready immediately
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
          setPosition(null);
          return;
        }

        // Check if device is mobile
        const isMobileScreen = window.innerWidth < 768;

        // Position: Below selection for Mobile (to avoid Android/iOS popup), Above selection for Desktop
        const topPos = isMobileScreen
          ? rect.bottom + 8 + window.scrollY
          : rect.top - 42 + window.scrollY;

        setPosition({
          top: Math.max(10, topPos),
          left: Math.max(60, Math.min(window.innerWidth - 60, rect.left + rect.width / 2 + window.scrollX)),
        });

        setSelectionData({
          postNumber,
          text,
        });
      } catch (e) {
        setPosition(null);
      }
    };

    const handleEvent = () => {
      clearTimeout(timeoutId);
      // Increased delay for mobile to ensure the native selection UI has settled
      timeoutId = setTimeout(handleSelection, 200);
    };

    document.addEventListener("selectionchange", handleEvent);
    document.addEventListener("mouseup", handleEvent);
    document.addEventListener("touchend", handleEvent);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("selectionchange", handleEvent);
      document.removeEventListener("mouseup", handleEvent);
      document.removeEventListener("touchend", handleEvent);
    };
  }, []);

  if (!position || !selectionData) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
        zIndex: 60,
      }}
      className="animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onQuote(selectionData.postNumber, selectionData.text);
          window.getSelection()?.removeAllRanges();
          setPosition(null);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onQuote(selectionData.postNumber, selectionData.text);
          window.getSelection()?.removeAllRanges();
          setPosition(null);
        }}
        className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-accent-foreground/20 flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        <Quote className="h-3 w-3" />
        <span>Kutip Teks</span>
      </button>
    </div>
  );
}
