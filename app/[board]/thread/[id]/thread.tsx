"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReplyForm } from "@/components/reply-form";
import { ImageLightbox } from "@/components/image-lightbox";
import { FormattedText } from "@/components/formatted-text";
import { Backlinks } from "@/components/backlinks";
import { ThreadUI } from "@/lib/entities/thread.entity";
import { ReplyUI } from "@/lib/entities/reply.entity";
import { useRouter } from "next/navigation";
import { FormattedDate } from "@/components/formatted-date";
import { QuickReply } from "@/components/quick-reply";
import { ExpandableImage } from "@/components/expandable-image";
import { TripcodeDisplay } from "@/components/tripcode-display";
import { ReplyProvider, useReply } from "@/components/reply-context";
import { useThreadWatcher } from "@/components/thread-watcher-provider";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useTransition } from "react";
import { useHiding } from "@/hooks/use-hiding";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, RefreshCw, MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { PostActions } from "@/components/post-actions";
import { CapcodeMarker } from "@/components/capcode-marker";
import { SelectionQuotePopover } from "@/components/selection-quote-popover";

interface ThreadClientProps {
  thread: ThreadUI;
  replies: ReplyUI[];
  boardCode: string;
  userRole?: string;
}

const POSTER_ID_STYLES = [
  "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
  "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
  "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300",
  "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300",
  "bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300",
  "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300",
] as const;

function getPosterStyle(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return POSTER_ID_STYLES[Math.abs(hash) % POSTER_ID_STYLES.length];
}

export function ThreadClient({
  thread,
  replies,
  boardCode,
  userRole,
}: ThreadClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const router = useRouter();
  const { setContent } = useReply();
  const { watchedThreads, watchThread, unwatchThread, markAsRead } = useThreadWatcher();
  const { isReplyHidden, hideThread, hideReply, unhideReply, isLoaded } = useHiding();
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile();

  const [fabCanScroll, setFabCanScroll] = useState(false);
  const [fabAtTop, setFabAtTop] = useState(true);
  const [fabAtBottom, setFabAtBottom] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    document.body.classList.add("thread-fab-open");
    return () => document.body.classList.remove("thread-fab-open");
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const check = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight > 300;
      setFabCanScroll(scrollable);
      setFabAtTop(window.scrollY <= 300);
      setFabAtBottom(
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300
      );
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [isMobile]);

  const isWatched = watchedThreads.some(t => t.id === thread.id);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const toggleHighlightId = (id: string) => {
    setHighlightedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    markAsRead(thread.id, replies.length);
  }, [thread.id, replies.length, markAsRead]);

  // Hide global scroll-to-top/bottom buttons while the mobile reply drawer is open
  useEffect(() => {
    const open = isMobile && qrOpen;
    document.body.classList.toggle("reply-drawer-open", open);
    window.dispatchEvent(new Event("reply-drawer-toggle"));
    return () => {
      document.body.classList.remove("reply-drawer-open");
    };
  }, [isMobile, qrOpen]);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setLightboxOpen(true);
  };

  const handleLightboxOpenChange = (open: boolean) => {
    setLightboxOpen(open);
    if (!open) {
      setSelectedImage("");
    }
  };

  const handleQuote = (postNumber: number, e?: React.MouseEvent, customText?: string) => {
    if (e) {
      e.preventDefault();
    }
    
    setQrOpen(true);
    
    // Selection to Quote feature - capture selection immediately
    let selectedText = customText || "";
    if (!selectedText && typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim();
      }
    }

    let quoteText = `>>${postNumber}\n`;
    
    if (selectedText) {
      // Format as green quote
      const lines = selectedText.split("\n");
      const formattedLines = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `>${line}`);
      
      if (formattedLines.length > 0) {
        quoteText += formattedLines.join("\n") + "\n\n";
      }
    }

    setContent((prev: string) => prev + quoteText);

    setTimeout(() => {
      const textarea =
        document.getElementById("qr-reply-content") ||
        document.getElementById("reply-content");
      if (textarea) (textarea as HTMLTextAreaElement).focus();
    }, 50);
  };

  const allPosts = [
    {
      type: "thread" as const,
      id: thread.id,
      postNumber: thread.postNumber,
      content: thread.content,
    },
    ...replies.map((r) => ({
      type: "reply" as const,
      id: r.id,
      postNumber: r.postNumber,
      content: r.content,
    })),
  ];

  const getBacklinks = (targetPostNumber: number) => {
    return allPosts.filter((post) => {
      const quoteRegex = />>(\d+)/g;
      const matches = post.content.matchAll(quoteRegex);
      for (const match of matches) {
        if (Number.parseInt(match[1]) === targetPostNumber) {
          return true;
        }
      }
      return false;
    });
  };

  return (
    <>
      {/* OP Post */}
      <div
        id={`p${thread.postNumber}`}
        className={cn(
          "ib-post mb-1 scroll-mt-14",
          highlightedId && thread.posterId === highlightedId && "ring-1 ring-accent/30 bg-accent/[0.015] rounded-sm"
        )}
      >
        <div className="ib-post-metaline border-b border-muted/20 pb-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 ml-2 hidden sm:inline-flex",
              isWatched ? "text-accent" : "text-muted-foreground"
            )}
            onClick={() => {
              if (isWatched) {
                unwatchThread(thread.id);
              } else {
                watchThread({
                  id: thread.id,
                  boardCode: boardCode,
                  subject: thread.subject,
                  lastReadReplyCount: replies.length,
                  snippet: thread.content.substring(0, 50) + (thread.content.length > 50 ? "..." : "")
                });
              }
            }}
            title={isWatched ? "Berhenti pantau thread" : "Pantau thread ini"}
          >
            {isWatched ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          {thread.isDeleted && (
            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded mr-2 font-bold border border-red-500/20">
              Postingan dihapus
            </span>
          )}
          {thread.isPinned && (
            <Pin className="h-3 w-3 text-accent fill-accent" />
          )}
          {thread.isLocked && (
            <Lock className="h-3 w-3 text-muted-foreground" />
          )}
          {thread.subject && (
            <h1 className="ib-subject text-lg mr-2 inline">{thread.subject}</h1>
          )}
          <div className="flex items-baseline gap-1">
            <TripcodeDisplay
              author={thread.author || "Awanama"}
              className="ib-author text-base"
              hideTrip={!!thread.capcode}
            />
            <CapcodeMarker type={thread.capcode} className="text-base" />
          </div>
          {thread.posterId && (
            <span
              className={cn(
                "text-[10px] px-1.5 rounded font-mono ml-1 cursor-pointer transition-colors",
                highlightedId === thread.posterId
                  ? "text-accent bg-accent/10"
                  : getPosterStyle(thread.posterId)
              )}
              onClick={() => toggleHighlightId(thread.posterId!)}
              title="Klik untuk sorot semua post dari ID ini"
            >
              ID: {thread.posterId}
            </span>
          )}
          <span className="text-muted-foreground opacity-70 text-xs shrink-0">
            <FormattedDate date={thread.createdAt} compact className="sm:hidden" />
            <FormattedDate date={thread.createdAt} className="hidden sm:inline" />
          </span>
          <span className="flex items-center">
            <Link
              href={`/${boardCode}/thread/${thread.id}#p${thread.postNumber}`}
              className="ib-post-number"
              title="Tautan Postingan"
            >
              No.
            </Link>
            <span
              className="ib-post-number cursor-pointer"
              onMouseDown={(e) => handleQuote(thread.postNumber, e)}
              onClick={(e) => handleQuote(thread.postNumber, e)}
              title="Balas postingan ini"
            >
              {thread.postNumber}
            </span>
            <PostActions 
              postId={thread.id} 
              postType="thread" 
              boardCode={boardCode} 
              onHide={() => hideThread(thread.id)}
              isOP={true}
              onQuote={() => handleQuote(thread.postNumber)}
            />
          </span>


        </div>

        <div className="mt-1 block">
          {thread.image && (
            <ExpandableImage
              src={thread.image}
              alt="Thread image"
              metadata={thread.imageMetadata || undefined}
              isOP={true}
              isNsfw={thread.isNsfw}
              isSpoiler={thread.isSpoiler}
              onFullScreen={() => handleImageClick(thread.image!)}
            />
          )}
          <div className="text-base leading-relaxed whitespace-pre-wrap break-words ib-content" data-post-content="true">
            <FormattedText content={thread.content} />
            <Backlinks links={getBacklinks(thread.postNumber)} />
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-1 mb-8">
        {replies.map((reply) => {
          const hidden = isLoaded && isReplyHidden(reply.id);
          
          if (hidden) {
            return (
              <div 
                key={reply.id} 
                className="ib-reply border border-muted/20 shadow-sm sm:table block w-fit max-w-full"
              >
                <div className="px-2 bg-muted/5 flex items-center gap-1 text-[10px] text-muted-foreground opacity-80">
                  <button 
                    onClick={() => unhideReply(reply.id)}
                    className="hover:underline font-bold"
                    title="Tampilkan kembali"
                  >
                    <span>[Tampilkan Balasan No.{reply.postNumber}]</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={reply.id} className="flex items-start gap-1">
              <span className="text-muted-foreground/20 font-serif select-none mt-2 hidden lg:inline-block">
                &gt;&gt;
              </span>
              <div
                key={reply.id}
                id={`p${reply.postNumber}`}
                className={cn(
                  "ib-reply border border-muted/20 shadow-sm relative group sm:table block w-fit max-w-full scroll-mt-14",
                  reply.isDeleted && "opacity-70 grayscale-[50%]",
                  highlightedId && reply.posterId === highlightedId && "ring-1 ring-accent/30 bg-accent/[0.015] rounded-sm"
                )}
              >
                <div className={`ib-post-metaline px-2 pt-1 border-b ${reply.isDeleted ? 'bg-red-500/5' : 'bg-muted/5'}`}>
                  {reply.isDeleted && (
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-1 mr-1 rounded font-bold border border-red-500/20">
                      DIHAPUS
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <TripcodeDisplay
                      author={reply.author || "Awanama"}
                      className="ib-author"
                      hideTrip={!!reply.capcode}
                    />
                    <CapcodeMarker type={reply.capcode} />
                  </div>
                  {reply.posterId && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 rounded font-mono ml-1 cursor-pointer transition-colors",
                        highlightedId === reply.posterId
                          ? "text-accent bg-accent/10"
                          : getPosterStyle(reply.posterId)
                      )}
                      onClick={() => toggleHighlightId(reply.posterId!)}
                      title="Klik untuk sorot semua post dari ID ini"
                    >
                      ID: {reply.posterId}
                    </span>
                  )}
                  {thread.posterId && reply.posterId === thread.posterId && (
                    <span className="text-[10px] text-accent font-bold ml-1">OP</span>
                  )}
                  <span className="text-muted-foreground opacity-70 text-xs shrink-0">
                    <FormattedDate date={reply.createdAt} compact className="sm:hidden" />
                    <FormattedDate date={reply.createdAt} className="hidden sm:inline" />
                  </span>
                  <span className="flex items-center">
                    <Link
                      href={`/${boardCode}/thread/${thread.id}#p${reply.postNumber}`}
                      className="ib-post-number"
                      title="Tautan Postingan"
                    >
                      No.
                    </Link>
                    <span
                      className="ib-post-number cursor-pointer"
                      onMouseDown={(e) => handleQuote(reply.postNumber, e)}
                      onClick={(e) => handleQuote(reply.postNumber, e)}
                      title="Balas postingan ini"
                    >
                      {reply.postNumber}
                    </span>
                    <PostActions 
                      postId={reply.id} 
                      postType="reply" 
                      boardCode={boardCode} 
                      onHide={() => hideReply(reply.id)}
                      onQuote={() => handleQuote(reply.postNumber)}
                    />
                  </span>
                </div>

                <div className="p-1 px-2 block overflow-hidden">
                  {reply.image && (
                    <ExpandableImage
                      src={reply.image}
                      alt="Reply image"
                      metadata={reply.imageMetadata || undefined}
                      isNsfw={reply.isNsfw}
                      isSpoiler={reply.isSpoiler}
                      onFullScreen={() => handleImageClick(reply.image!)}
                    />
                  )}
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-sm lg:text-base" data-post-content="true">
                    <FormattedText content={reply.content} />
                    <Backlinks links={getBacklinks(reply.postNumber)} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {replies.length === 0 && (
          <div className="flex items-start gap-1">
            <span className="text-muted-foreground/20 font-serif select-none mt-2 hidden lg:inline-block">
              &gt;&gt;
            </span>
            <div className="px-6 py-8 text-center text-muted-foreground italic border border-dashed border-muted/50 rounded-lg sm:table block w-fit max-w-full">
              Belum ada balasan. Jadilah yang pertama memberikan tanggapan!
            </div>
          </div>
        )}
      </div>

      {/* Reply Form Section */}
      <div className="mt-12 border-t border-muted/20 pt-8">
        <div className="w-full max-w-2xl mx-auto bg-muted/10 border border-muted/30 rounded-md p-4 sm:p-5">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="text-accent underline decoration-2 underline-offset-2">
              Kirim Balasan
            </span>
            {thread.isLocked && (
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </h3>

          {!thread.isLocked ? (
            <ReplyForm 
              threadId={thread.id} 
              boardCode={boardCode} 
              userRole={userRole}
            />
          ) : (
            <div className="py-6 text-center bg-muted/20 rounded">
              <Lock className="h-7 w-7 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-sm">
                Thread ini terkunci. Anda tidak bisa mengirim balasan baru.
              </p>
            </div>
          )}
        </div>
      </div>

      <ImageLightbox
        src={selectedImage}
        alt="Image lightbox"
        open={lightboxOpen}
        onOpenChange={handleLightboxOpenChange}
      />

      <QuickReply
        threadId={thread.id}
        boardCode={boardCode}
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        userRole={userRole}
      />

      <SelectionQuotePopover
        onQuote={(postNumber, selectedText) => handleQuote(postNumber, undefined, selectedText)}
      />

      {/* Mobile Floating Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-3 left-1/2 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 z-40 bg-card/90 backdrop-blur-md border border-border shadow-xl rounded-full px-2.5 py-1.5 flex items-center gap-1 overflow-x-auto">
          <Link
            href={`/${boardCode}`}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
            title="Kembali ke Board"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>/{boardCode}/</span>
          </Link>

          <div className="w-[1px] h-4 bg-border shrink-0" />

          <button
            onClick={() => {
              startTransition(() => {
                router.refresh();
              });
            }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
            title="Segarkan Halaman"
          >
            <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
          </button>

          <button
            onClick={() => {
              if (isWatched) {
                unwatchThread(thread.id);
              } else {
                watchThread({
                  id: thread.id,
                  boardCode: boardCode,
                  subject: thread.subject,
                  lastReadReplyCount: replies.length,
                  snippet: thread.content.substring(0, 50) + (thread.content.length > 50 ? "..." : "")
                });
              }
            }}
            className={cn(
              "p-2 transition-colors shrink-0 cursor-pointer",
              isWatched ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
            title={isWatched ? "Berhenti pantau thread" : "Pantau thread"}
          >
            {isWatched ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          {!thread.isLocked && (
            <>
              <div className="w-[1px] h-4 bg-border shrink-0" />
              <Button
                onClick={() => setQrOpen(true)}
                size="sm"
                className="h-8 px-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-1.5 text-xs font-bold shadow shrink-0 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Balas</span>
              </Button>
            </>
          )}

          {fabCanScroll && (
            <>
              <div className="w-[1px] h-4 bg-border shrink-0" />
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                disabled={fabAtTop}
                className={cn(
                  "p-2 transition-colors shrink-0 cursor-pointer",
                  fabAtTop
                    ? "text-muted-foreground/40 cursor-default pointer-events-none"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Ke Atas"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
                disabled={fabAtBottom}
                className={cn(
                  "p-2 transition-colors shrink-0 cursor-pointer",
                  fabAtBottom
                    ? "text-muted-foreground/40 cursor-default pointer-events-none"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Ke Bawah"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}

      <div id="bottom" />
    </>
  );
}


export default function ThreadPageWrapper(props: ThreadClientProps) {
  return (
    <ReplyProvider>
      <ThreadClient {...props} />
    </ReplyProvider>
  );
}
