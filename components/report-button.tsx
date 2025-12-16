"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Flag } from "lucide-react"
import { useRouter } from "next/navigation"
import { createReport } from "@/lib/actions/moderation.actions"
import { useToast } from "@/hooks/use-toast"

interface ReportButtonProps {
  contentType: "thread" | "reply"
  contentId: number
}

export function ReportButton({ contentType, contentId }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const reason = formData.get("reason") as string

    try {
      const result = await createReport(contentType, contentId, reason)

      if (result.success) {
        setIsOpen(false)
        ;(e.target as HTMLFormElement).reset()
        toast({
          title: "Report Submitted",
          description: "Thank you for your report. Our moderators will review it shortly.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit report",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Please provide a reason for reporting this {contentType}. Reports are reviewed by moderators.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Describe why you are reporting this content"
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
