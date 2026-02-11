import { headers } from "next/headers"

export async function getClientIp(): Promise<string> {
    const headerList = await headers()

    // Vercel / Cloudflare / Nginx headers
    const forwarded = headerList.get("x-forwarded-for")
    const realIp = headerList.get("x-real-ip")

    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }

    if (realIp) {
        return realIp
    }

    return "127.0.0.1"
}
