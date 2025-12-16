"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { createReply } from "@/lib/actions/reply.actions"
import { ImageUploader } from "./image-uploader"

interface ReplyFormProps {
  threadId: number
  boardCode: string
}

export function ReplyForm({ threadId, boardCode }: ReplyFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("threadId", threadId.toString())
    formData.append("boardCode", boardCode)

    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      const result = await createReply(formData)

      if (result.success) {
        formRef.current?.reset()
        setImageFile(null)
        setError(null)
        setIsOpen(false)
        router.refresh()
      } else {
        setError(result.error || "Failed to post reply")
      }
    } catch (error) {
      console.error("Error posting reply:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setImageFile(null)
    formRef.current?.reset()
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <MessageSquare className="h-4 w-4 mr-2" />
        Post Reply
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Post Reply</CardTitle>
            <CardDescription>Add your response to this thread</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="reply-author">Name (optional)</Label>
            <Input id="reply-author" name="author" placeholder="Anonymous" maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply-content">Content</Label>
            <Textarea
              id="reply-content"
              name="content"
              placeholder="Enter your reply"
              required
              rows={5}
              className="resize-none"
            />
          </div>

          <ImageUploader onImageSelect={setImageFile} maxSizeMB={5} />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
