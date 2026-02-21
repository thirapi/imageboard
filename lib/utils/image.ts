/**
 * Generates a Cloudinary thumbnail URL with specified transformations.
 * Default transformations: fill crop, 250x250, auto quality and format.
 */
export function getThumbnailUrl(
    url: string | null | undefined,
    width = 250,
    height = 250,
    mode = 'fill'
): string {
    if (!url) return "/placeholder.svg";

    // If not a cloudinary URL, return as is
    if (!url.includes("cloudinary.com")) return url;

    // Cloudinary URL structure: .../upload/v12345/public_id.jpg
    const parts = url.split("/upload/");
    if (parts.length < 2) return url;

    // The last part contains the version and public ID
    const base = parts.slice(0, -1).join("/upload/");
    const rest = parts[parts.length - 1];

    // Only use g_auto with cropping modes (fill, thumb, crop)
    const hasGravity = ["fill", "thumb", "crop"].includes(mode);
    const transformations = [
        `c_${mode}`,
        `w_${width}`,
        height ? `h_${height}` : "",
        hasGravity ? "g_auto" : "",
        "q_auto",
        "f_auto",
    ].filter(Boolean).join(",");

    return `${base}/upload/${transformations}/${rest}`;
}

/**
 * Generates a lower quality/smaller version for feed display
 */
export function getFeedImageUrl(url: string | null | undefined, width = 400): string {
    if (!url) return "/placeholder.svg";
    if (!url.includes("cloudinary.com")) return url;

    const parts = url.split("/upload/");
    if (parts.length < 2) return url;

    const base = parts.slice(0, -1).join("/upload/");
    const rest = parts[parts.length - 1];

    const transformations = `c_scale,w_${width},q_auto,f_auto`;
    return `${base}/upload/${transformations}/${rest}`;
}
