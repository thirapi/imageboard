import type { BanRepository, BanEntity } from "@/lib/repositories/ban.repository"

export class GetBansUseCase {
    constructor(private banRepository: BanRepository) { }

    async execute(): Promise<BanEntity[]> {
        return await this.banRepository.findAll()
    }
}
