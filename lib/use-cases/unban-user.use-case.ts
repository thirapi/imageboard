import type { BanRepository } from "@/lib/repositories/ban.repository"

export class UnbanUserUseCase {
    constructor(private banRepository: BanRepository) { }

    async execute(ipAddress: string): Promise<void> {
        if (!ipAddress) {
            throw new Error("IP Address is required")
        }

        await this.banRepository.deleteByIp(ipAddress)
    }
}
