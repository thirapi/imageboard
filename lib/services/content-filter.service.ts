// Service for content filtering and moderation
export class ContentFilterService {
  private bannedWords: string[] = [
    // Add banned words here
  ]

  filterContent(content: string): { isAllowed: boolean; reason?: string } {
    const lowerContent = content.toLowerCase()

    // Check for banned words
    for (const word of this.bannedWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        return {
          isAllowed: false,
          reason: "Content contains prohibited words",
        }
      }
    }

    // Check for excessive caps (spam indicator)
    const capsCount = (content.match(/[A-Z]/g) || []).length
    const lettersCount = (content.match(/[a-zA-Z]/g) || []).length

    if (lettersCount > 20 && capsCount / lettersCount > 0.7) {
      return {
        isAllowed: false,
        reason: "Excessive use of capital letters",
      }
    }

    return { isAllowed: true }
  }

  sanitizeContent(content: string): string {
    // Remove excessive whitespace
    return content.trim().replace(/\s+/g, " ")
  }
}
