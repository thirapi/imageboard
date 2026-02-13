import type { BanRepository } from "@/lib/repositories/ban.repository"

export interface UpdateBanCommand {
    id: number
    reason?: string
    durationHours?: number | null // null for permanent
}

export class UpdateBanUseCase {
    constructor(private banRepository: BanRepository) { }

    async execute(command: UpdateBanCommand): Promise<void> {
        let expiresAt: Date | null | undefined

        if (command.durationHours === null) {
            expiresAt = null
        } else if (command.durationHours !== undefined) {
            expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + command.durationHours)
        }

        await this.banRepository.update(command.id, {
            reason: command.reason,
            expiresAt
        })
    }
}
