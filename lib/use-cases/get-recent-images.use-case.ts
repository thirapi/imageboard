import type { PostRepository } from "@/lib/repositories/post.repository"
import type { RecentImageEntity } from "@/lib/entities/post.entity"

export class GetRecentImagesUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(limit = 12): Promise<RecentImageEntity[]> {
    // Business rule: Limit must be between 1 and 50
    const validLimit = Math.max(1, Math.min(limit, 50))

    return await this.postRepository.getRecentImages(validLimit)
  }
}
