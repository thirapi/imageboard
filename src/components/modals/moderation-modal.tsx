"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flag, Trash2, AlertTriangle } from "lucide-react"

interface ModerationModalProps {
  type: "report" | "delete"
  postId: string
  trigger?: React.ReactNode
}

export function ModerationModal({ type, postId, trigger }: ModerationModalProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportCategories = [
    "Spam or advertising",
    "Harassment or abuse",
    "Inappropriate content",
    "Copyright violation",
    "Off-topic content",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (type === "report" && (!category || !reason.trim())) return
    if (type === "delete" && !reason.trim()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setReason("")
    setCategory("")
    setIsSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            {type === "report" ? <Flag className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "report" ? (
              <>
                <Flag className="w-5 h-5" />
                Report Post
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Delete Post
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "report" && (
            <div className="space-y-2">
              <Label htmlFor="category">Reason for reporting</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">
              {type === "report" ? "Additional details (optional)" : "Reason for deletion"}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                type === "report"
                  ? "Provide additional context about why you're reporting this post..."
                  : "Explain why this post should be deleted..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {type === "delete" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. The post and all its replies will be permanently deleted.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === "delete" ? "destructive" : "default"}
              disabled={
                isSubmitting ||
                (type === "report" && (!category || !reason.trim())) ||
                (type === "delete" && !reason.trim())
              }
            >
              {isSubmitting
                ? type === "report"
                  ? "Reporting..."
                  : "Deleting..."
                : type === "report"
                  ? "Submit Report"
                  : "Delete Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
