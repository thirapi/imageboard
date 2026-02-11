"use server"

import { container } from "@/lib/di/container"
import { revalidatePath } from "next/cache"

import { getClientIp } from "@/lib/utils/get-ip"
import { CaptchaService } from "@/lib/services/captcha.service"

const { replyController } = container

export async function createReply(formData: FormData) {
  try {
    const ipAddress = await getClientIp()
    const captchaAnswer = formData.get("captcha") as string

    const isValidCaptcha = await CaptchaService.verify(captchaAnswer)
    if (!isValidCaptcha) {
      throw new Error("Jawaban CAPTCHA salah atau sudah kadaluarsa.")
    }

    // Extract and forward request
    const threadId = Number.parseInt(formData.get("threadId") as string)
    const boardCode = formData.get("boardCode") as string
    const content = formData.get("content") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File | null
    const deletionPassword = formData.get("deletionPassword") as string

    const result = await replyController.createReply({
      threadId,
      content,
      author,
      imageFile,
      deletionPassword,
      ipAddress,
    })

    revalidatePath(`/${boardCode}/thread/${threadId}`)
    return { success: true, replyId: result.replyId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create reply" }
  }
}
