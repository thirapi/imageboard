"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Lock, Pin, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  lockThread,
  pinThread,
  deleteThread,
  deleteReply,
  resolveReport,
  dismissReport,
} from "@/lib/actions/moderation.actions"
import { useToast } from "@/hooks/use-toast"

interface ModActionsProps {
  reportId: number
  contentType: string
  contentId: number
}

export function ModActions({ reportId, contentType, contentId }: ModActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleAction(action: string) {
    setIsProcessing(true)

    try {
      let result

      switch (action) {
        case "lock":
          if (contentType === "thread") {
            result = await lockThread(contentId)
          }
          break
        case "pin":
          if (contentType === "thread") {
            result = await pinThread(contentId)
          }
          break
        case "delete":
          if (contentType === "thread") {
            result = await deleteThread(contentId)
          } else {
            result = await deleteReply(contentId)
          }
          break
        case "resolve":
          result = await resolveReport(reportId)
          break
        case "dismiss":
          result = await dismissReport(reportId)
          break
      }

      if (result?.success) {
        toast({
          title: "Success",
          description: "Action completed successfully",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to perform action",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error performing action:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {contentType === "thread" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("lock")}
            disabled={isProcessing}
            className="flex-1"
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock Thread
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("pin")}
            disabled={isProcessing}
            className="flex-1"
          >
            <Pin className="h-4 w-4 mr-2" />
            Pin Thread
          </Button>
        </>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleAction("delete")}
        disabled={isProcessing}
        className="flex-1"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("resolve")}
        disabled={isProcessing}
        className="flex-1"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Resolve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("dismiss")}
        disabled={isProcessing}
        className="flex-1"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Dismiss
      </Button>
    </div>
  )
}
