import { createHash } from "crypto";

/**
 * Generates a tripcode from a name string containing a '#' character.
 * Example: "Anon#password" -> "Anon !3G9n6j2n12"
 */
export function generateTripcode(author: string): string {
    if (!author.includes("#")) {
        return author;
    }

    const parts = author.split("#");
    const name = parts[0].trim() || "Awanama";
    const password = parts.slice(1).join("#"); // Handle multiple '#' if any

    if (!password) {
        return name;
    }

    // A simple but effective way to generate a tripcode
    // We use SHA-256 and take the first 10 characters of the base64-like result
    const hash = createHash("sha256")
        .update(password + "salt-for-tripcode") // Adding a salt for better security
        .digest("base64")
        .replace(/[+/=]/g, "") // Clean typical base64 chars for cleaner tripcode
        .substring(0, 10);

    return `${name} !${hash}`;
}
