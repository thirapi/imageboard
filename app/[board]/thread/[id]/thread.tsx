"use client";

import { useState } from "react";
import { Lock, Pin, RefreshCw } from "lucide-react";
import { ReplyForm } from "@/components/reply-form";
import { ReportButton } from "@/components/report-button";
import { ImageLightbox } from "@/components/image-lightbox";
import { FormattedText } from "@/components/formatted-text";
import { Backlinks } from "@/components/backlinks";
import { DeletePostButton } from "@/components/delete-post-button";
import { ThreadUI } from "@/lib/entities/thread.entity";
import { ReplyUI } from "@/lib/entities/reply.entity";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormattedDate } from "@/components/formatted-date";
import { QuickReply } from "@/components/quick-reply";
import { ExpandableImage } from "@/components/expandable-image";

interface ThreadClientProps {
  thread: ThreadUI;
  replies: ReplyUI[];
  boardCode: string;
}

function generatePosterId(
  ip: string | null | undefined,
  threadId: number,
): string {
  if (!ip) return "";
  let hash = 0;
  // Use a simple but consistent shift-and-add hash
  const combined = ip + "salt" + threadId.toString();
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}

export function ThreadClient({
  thread,
  replies,
  boardCode,
}: ThreadClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const router = useRouter();

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

  const handleQuote = (postNumber: number) => {
    setQrOpen(true);

    // Wait for QR to be in DOM
    setTimeout(() => {
      const textarea = document.getElementById(
        "qr-reply-content",
      ) as HTMLTextAreaElement;
      if (textarea) {
        const currentText = textarea.value;
        const quoteText = `>>${postNumber}\n`;

        // Update value
        textarea.value = currentText + quoteText;

        // Focus
        textarea.focus();
      }
    }, 50);
  };

  // Backlink calculation
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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
          className="rounded-full shadow-sm"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Perbarui (Refresh)
        </Button>
      </div>

      {/* OP Post */}
      <div id={`p${thread.postNumber}`} className="ib-post mb-12">
        <div className="ib-post-metaline border-b border-muted/20 pb-1">
          {thread.isPinned && (
            <Pin className="h-3 w-3 text-accent fill-accent" />
          )}
          {thread.isLocked && (
            <Lock className="h-3 w-3 text-muted-foreground" />
          )}
          {thread.subject && (
            <span className="ib-subject text-lg mr-2">{thread.subject}</span>
          )}
          <span className="ib-author text-base">
            {thread.author || "Anonymous"}
          </span>
          {generatePosterId(thread.ipAddress, thread.id) && (
            <span className="text-[10px] bg-muted px-1 rounded text-muted-foreground ml-1 font-mono">
              ID: {generatePosterId(thread.ipAddress, thread.id)}
            </span>
          )}
          <span className="text-muted-foreground text-xs">
            <FormattedDate date={thread.createdAt} />
          </span>
          <span
            className="ib-post-number font-bold ml-1 cursor-pointer hover:underline"
            onClick={() => handleQuote(thread.postNumber)}
          >
            No.{thread.postNumber}
          </span>

          <div className="flex items-center gap-1 ml-auto">
            <DeletePostButton
              postId={thread.id}
              postType="thread"
              boardCode={boardCode}
            />
            <ReportButton contentType="thread" contentId={thread.id} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          {thread.image && (
            <div className="shrink-0 max-w-sm">
              <ExpandableImage
                src={thread.image}
                alt="Thread image"
                metadata={thread.imageMetadata || undefined}
                isOP={true}
                onFullScreen={() => handleImageClick(thread.image!)}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="text-base leading-relaxed whitespace-pre-wrap break-words ib-content">
              <FormattedText content={thread.content} />
              <Backlinks links={getBacklinks(thread.postNumber)} />
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4 mb-12 ml-0 sm:ml-8 lg:ml-12 border-l-2 border-muted/10 pl-4 sm:pl-8">
        {replies.map((reply) => (
          <div
            key={reply.id}
            id={`p${reply.postNumber}`}
            className="ib-reply border border-muted/20 shadow-sm relative group"
          >
            <div className="ib-post-metaline px-2 pt-1 border-b border-muted/5 bg-muted/5">
              <span className="ib-author">{reply.author || "Anonymous"}</span>
              {generatePosterId(reply.ipAddress, thread.id) && (
                <span className="text-[10px] bg-muted px-1 rounded text-muted-foreground ml-1 font-mono">
                  ID: {generatePosterId(reply.ipAddress, thread.id)}
                </span>
              )}
              <span className="text-muted-foreground opacity-70 text-xs">
                <FormattedDate date={reply.createdAt} />
              </span>
              <span
                className="ib-post-number font-bold cursor-pointer hover:underline"
                onClick={() => handleQuote(reply.postNumber)}
              >
                No.{reply.postNumber}
              </span>

              <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <DeletePostButton
                  postId={reply.id}
                  postType="reply"
                  boardCode={boardCode}
                />
                <ReportButton contentType="reply" contentId={reply.id} />
              </div>
            </div>

            <div className="p-3">
              {reply.image && (
                <div className="mb-3">
                  <ExpandableImage
                    src={reply.image}
                    alt="Reply image"
                    metadata={reply.imageMetadata || undefined}
                    onFullScreen={() => handleImageClick(reply.image!)}
                  />
                </div>
              )}
              <div className="whitespace-pre-wrap break-words leading-relaxed text-sm lg:text-base">
                <FormattedText content={reply.content} />
                <Backlinks links={getBacklinks(reply.postNumber)} />
              </div>
            </div>
          </div>
        ))}

        {replies.length === 0 && (
          <div className="py-12 text-center text-muted-foreground italic border border-dashed rounded-lg">
            Belum ada balasan. Jadilah yang pertama memberikan tanggapan!
          </div>
        )}
      </div>

      {/* Reply Form Section */}
      <div className="mt-20 border-t pt-12 flex justify-center">
        <div className="w-full max-w-2xl bg-card p-6 rounded-xl border shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-accent underline decoration-2">
              Kirim Balasan
            </span>
            {thread.isLocked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </h3>

          {!thread.isLocked ? (
            <ReplyForm threadId={thread.id} boardCode={boardCode} />
          ) : (
            <div className="py-8 text-center bg-muted/20 rounded-lg">
              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
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
      />
    </>
  );
}
