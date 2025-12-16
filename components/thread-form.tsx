"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/thread.actions"
import { ImageUploader } from "./image-uploader"

interface ThreadFormProps {
  boardId: number
  boardCode: string
}

export function ThreadForm({ boardId, boardCode }: ThreadFormProps) {
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
    formData.append("boardId", boardId.toString())
    formData.append("boardCode", boardCode)

    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      const result = await createThread(formData)

      if (result.success && result.threadId) {
        formRef.current?.reset()
        setImageFile(null)
        setIsOpen(false)
        router.push(`/${boardCode}/thread/${result.threadId}`)
        router.refresh()
      } else {
        setError(result.error || "Failed to create thread")
      }
    } catch (error) {
      console.error("Error creating thread:", error)
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
        <Plus className="h-4 w-4 mr-2" />
        Start New Thread
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Start New Thread</CardTitle>
            <CardDescription>Create a new discussion on this board</CardDescription>
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
            <Label htmlFor="author">Name (optional)</Label>
            <Input id="author" name="author" placeholder="Anonymous" maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input id="subject" name="subject" placeholder="Enter subject" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter your message"
              required
              rows={6}
              className="resize-none"
            />
          </div>

          <ImageUploader onImageSelect={setImageFile} maxSizeMB={5} />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Posting..." : "Post Thread"}
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
