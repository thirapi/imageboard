import type { ThreadRepository } from "@/lib/repositories/thread.repository"
import type { BoardRepository } from "@/lib/repositories/board.repository"
import type { ImageRepository } from "@/lib/repositories/image.repository"
import type { CloudinaryService } from "@/lib/services/cloudinary.service"
import type { CreateThreadCommand } from "@/lib/entities/thread.entity"

export class CreateThreadUseCase {
  constructor(
    private threadRepository: ThreadRepository,
    private boardRepository: BoardRepository,
    private imageRepository: ImageRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async execute(input: CreateThreadCommand): Promise<number> {
    // Business rule: Validate content length
    if (input.content.trim().length < 1) {
      throw new Error("Thread content cannot be empty")
    }

    if (input.content.length > 10000) {
      throw new Error("Thread content is too long (max 10000 characters)")
    }

    // Business rule: Validate board exists
    const board = await this.boardRepository.findById(input.boardId)
    if (!board) {
      throw new Error("Board not found")
    }

    // Business rule: Validate subject length if provided
    if (input.subject && input.subject.length > 200) {
      throw new Error("Subject is too long (max 200 characters)")
    }

    // Business rule: Clean author name
    const cleanedAuthor = input.author?.trim() || "Awanama"

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

    // Create thread
    const thread = await this.threadRepository.create({
      boardId: input.boardId,
      subject: input.subject,
      content: input.content,
      author: cleanedAuthor,
      image: imageUrl,
    })

    if (imageUrl && input.imageFile) {
      try {
        await this.imageRepository.create({
          url: imageUrl,
          publicId: imageUrl.split("/").pop()?.split(".")[0] || "",
          threadId: thread.id,
        })
      } catch (error) {
        console.error("[inzm] Failed to save image metadata:", error)
      }
    }

    return thread.id
  }
}
