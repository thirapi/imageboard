// components/thread-client.tsx (atau di folder page)
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { ReplyForm } from "@/components/reply-form"
import { ReportButton } from "@/components/report-button"
import { ImageLightbox } from "@/components/image-lightbox"
import { ThreadUI } from "@/lib/entities/thread.entity"
import { ReplyUI } from "@/lib/entities/reply.entity"

interface ThreadClientProps {
  thread: ThreadUI
  replies: ReplyUI[]
  boardCode: string
}

export function ThreadClient({ thread, replies, boardCode }: ThreadClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
    setLightboxOpen(true)
  }

  const handleLightboxOpenChange = (open: boolean) => {
    setLightboxOpen(open)
    if (!open) {
      setSelectedImage("")
    }
  }

  return (
    <>
      {/* OP Post */}
      <Card className="mb-6 border-accent">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>
                {thread.subject || "Tanpa Subjek"}{" "}
                <span className="text-muted-foreground font-normal">#{thread.id}</span>
              </CardTitle>
              <CardDescription>
                oleh {thread.author} • {thread.createdAt.toLocaleString()}
              </CardDescription>
            </div>
            <ReportButton contentType="thread" contentId={thread.id} />
          </div>
        </CardHeader>
        <CardContent>
          {thread.image && (
            <div className="mb-4">
              <img
                src={thread.image}
                alt="Gambar thread"
                className="max-w-md rounded border cursor-pointer"
                onClick={() => handleImageClick(thread.image!)}
              />
            </div>
          )}
          <p className="whitespace-pre-wrap text-balance">{thread.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardDescription className="flex-1">
                  <span className="font-medium text-foreground">{reply.author}</span> •{" "}
                  {reply.createdAt.toLocaleString()} • #{reply.id}
                </CardDescription>
                <ReportButton contentType="reply" contentId={reply.id} />
              </div>
            </CardHeader>
            <CardContent>
              {reply.image && (
                <div className="mb-4">
                  <img
                    src={reply.image}
                    alt="Gambar balasan"
                    className="max-w-md rounded border cursor-pointer"
                    onClick={() => handleImageClick(reply.image!)}
                  />
                </div>
              )}
              <p className="whitespace-pre-wrap text-balance">{reply.content}</p>
            </CardContent>
          </Card>
        ))}

        {replies.length === 0 && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              <p>Belum ada balasan. Jadilah yang pertama membalas!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Form atau Locked Message */}
      {!thread.isLocked && <ReplyForm threadId={thread.id} boardCode={boardCode} />}

      {thread.isLocked && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            <p>Thread ini terkunci. Tidak ada balasan baru yang bisa diposting.</p>
          </CardContent>
        </Card>
      )}

      <ImageLightbox
        src={selectedImage}
        alt="Image lightbox"
        open={lightboxOpen}
        onOpenChange={handleLightboxOpenChange}
      />
    </>
  )
}