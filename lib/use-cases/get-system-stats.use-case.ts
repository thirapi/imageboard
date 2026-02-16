import type { PostRepository } from "@/lib/repositories/post.repository"
import type { SystemStatsEntity } from "@/lib/entities/stats.entity"

export class GetSystemStatsUseCase {
    constructor(private postRepository: PostRepository) { }

    async execute(): Promise<SystemStatsEntity> {
        return await this.postRepository.getSystemStats()
    }
}
