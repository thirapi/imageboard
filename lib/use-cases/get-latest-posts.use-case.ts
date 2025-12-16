import type { PostRepository } from "@/lib/repositories/post.repository"
import type { LatestPostEntity } from "@/lib/entities/post.entity"

export class GetLatestPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(limit = 10): Promise<LatestPostEntity[]> {
    // Business rule: Limit must be between 1 and 50
    const validLimit = Math.max(1, Math.min(limit, 50))

    return await this.postRepository.getLatestPosts(validLimit)
  }
}
