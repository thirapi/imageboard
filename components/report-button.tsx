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
          title: "Laporan Terkirim",
          description: "Terima kasih atas laporan Anda. Moderator kami akan segera meninjaunya.",
        })
        router.refresh()
      } else {
        toast({
          title: "Kesalahan",
          description: result.error || "Gagal mengirim laporan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan tak terduga",
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
          Laporkan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Laporkan Konten</DialogTitle>
          <DialogDescription>
            Harap berikan alasan untuk melaporkan ini {contentType}. Laporan akan ditinjau oleh moderator.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Jelaskan mengapa Anda melaporkan konten ini"
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
