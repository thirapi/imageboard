"use server"

import { container } from "@/lib/di/container"
import { revalidatePath } from "next/cache"

import { getClientIp } from "@/lib/utils/get-ip"
import { CaptchaService } from "@/lib/services/captcha.service"

const { threadController } = container

export async function createThread(formData: FormData) {
  try {
    const ipAddress = await getClientIp()
    const captchaAnswer = formData.get("captcha") as string

    const isValidCaptcha = await CaptchaService.verify(captchaAnswer)
    if (!isValidCaptcha) {
      throw new Error("Jawaban CAPTCHA salah atau sudah kadaluarsa.")
    }

    // Extract and forward request
    const boardId = Number.parseInt(formData.get("boardId") as string)
    const boardCode = formData.get("boardCode") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File | null
    const deletionPassword = formData.get("deletionPassword") as string

    const result = await threadController.createThread({
      boardId,
      subject,
      content,
      author,
      imageFile,
      deletionPassword,
      ipAddress,
    })

    revalidatePath(`/${boardCode}`)
    return { success: true, threadId: result.threadId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create thread" }
  }
}

export async function getThreadList(boardId: number) {
  try {
    return await threadController.getThreadList(boardId)
  } catch (error) {
    console.error(`Error fetching thread list for board ${boardId}:`, error)
    return []
  }
}

export async function getThreadDetail(threadId: number) {
  try {
    return await threadController.getThreadDetail(threadId)
  } catch (error) {
    console.error(`Error fetching thread detail for thread ${threadId}:`, error)
    return null
  }
}

export async function getCaptcha() {
  return await CaptchaService.generate()
}
