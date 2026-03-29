/** Base URL for metadata / OG (set NEXT_PUBLIC_SITE_URL in production for stable canonical URLs). */
export function getMetadataBaseUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}
