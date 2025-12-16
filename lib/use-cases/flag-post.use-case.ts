import { createClient } from "@/lib/supabase/server"

export interface FlagPostInput {
  contentType: "thread" | "reply"
  contentId: number
  reason: string
}

export class FlagPostUseCase {
  async execute(input: FlagPostInput): Promise<void> {
    // Business rule: Validate content type
    if (input.contentType !== "thread" && input.contentType !== "reply") {
      throw new Error("Invalid content type")
    }

    // Business rule: Validate reason
    if (!input.reason || input.reason.trim().length < 10) {
      throw new Error("Reason must be at least 10 characters")
    }

    if (input.reason.length > 500) {
      throw new Error("Reason is too long (max 500 characters)")
    }

    // Create report
    const supabase = await createClient()

    const { error } = await supabase.from("reports").insert({
      content_type: input.contentType,
      content_id: input.contentId,
      reason: input.reason.trim(),
      status: "pending",
    })

    if (error) {
      throw new Error("Failed to submit report")
    }
  }
}
