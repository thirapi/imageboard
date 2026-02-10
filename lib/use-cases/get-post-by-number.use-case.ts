import type { PostRepository } from "@/lib/repositories/post.repository"
import type { PostInfoEntity } from "@/lib/entities/post.entity"

export class GetPostByNumberUseCase {
    constructor(private postRepository: PostRepository) { }

    async execute(postNumber: number): Promise<PostInfoEntity | null> {
        return await this.postRepository.findByPostNumber(postNumber)
    }
}
