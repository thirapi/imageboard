import { headers } from "next/headers"

export async function getClientIp(): Promise<string> {
    const headerList = await headers()

    // Cloudflare specific headers
    const cfConnectingIp = headerList.get("cf-connecting-ip")
    const trueClientIp = headerList.get("true-client-ip")

    // Vercel / Nginx / Generic proxy headers
    const forwarded = headerList.get("x-forwarded-for")
    const realIp = headerList.get("x-real-ip")

    if (cfConnectingIp) return cfConnectingIp
    if (trueClientIp) return trueClientIp

    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }

    if (realIp) {
        return realIp
    }

    return "127.0.0.1"
}
