import type { ReplyRepository } from "@/lib/repositories/reply.repository"
import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { ImageRepository } from "@/lib/repositories/image.repository"
import type { CloudinaryService } from "@/lib/services/cloudinary.service"
import type { CreateReplyCommand } from "@/lib/entities/reply.entity"
import { SequenceService } from "../services/sequence.service"

export class ReplyToThreadUseCase {
  constructor(
    private replyRepository: ReplyRepository,
    private threadRepository: ThreadRepository,
    private imageRepository: ImageRepository,
    private cloudinaryService: CloudinaryService,
    private sequenceService: SequenceService,
  ) {}

  async execute(input: CreateReplyCommand): Promise<number> {
    // Business rule: Validate content length
    if (input.content.trim().length < 1) {
      throw new Error("Reply content cannot be empty")
    }

    if (input.content.length > 10000) {
      throw new Error("Reply content is too long (max 10000 characters)")
    }

    // Business rule: Validate thread exists and is not locked
    const thread = await this.threadRepository.findById(input.threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    if (thread.isLocked) {
      throw new Error("Cannot reply to locked thread")
    }

    if (thread.isDeleted) {
      throw new Error("Cannot reply to deleted thread")
    }

    // Business rule: Clean author name
    const cleanedAuthor = input.author?.trim() || "Awanama"

    const postNumber = await this.sequenceService.getNextPostNumber();

    let imageUrl: string | undefined
    if (input.imageFile && input.imageFile.size > 0) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(input.imageFile)
        imageUrl = uploadResult.url

        console.log("[inzm] Image uploaded successfully:", uploadResult.url)
      } catch (error) {
        console.error("[inzm] Image upload failed:", error)
        throw new Error(`Image upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    // Create reply
    const reply = await this.replyRepository.create({
      threadId: input.threadId,
      content: input.content,
      author: cleanedAuthor,
      image: imageUrl,
      postNumber: postNumber
    })

    if (imageUrl && input.imageFile) {
      try {
        await this.imageRepository.create({
          url: imageUrl,
          publicId: imageUrl.split("/").pop()?.split(".")[0] || "",
          replyId: reply.id,
        })
      } catch (error) {
        console.error("[inzm] Failed to save image metadata:", error)
      }
    }

    // Business rule: Bump thread when reply is added
    await this.threadRepository.updateBumpTime(input.threadId)

    return reply.id
  }
}
