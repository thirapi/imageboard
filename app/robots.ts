import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://62chan.my.id";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/mod/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
