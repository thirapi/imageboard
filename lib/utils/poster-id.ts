export function generatePosterId(
    ip: string | null | undefined,
    threadId: number,
): string {
    if (!ip) return "";
    let hash = 0;
    // Use a simple but consistent shift-and-add hash
    const combined = ip + "salt" + threadId.toString();
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}
