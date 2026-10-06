/** Prefer an explicit public domain, otherwise use the current Vercel deployment. */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    const url = new URL(configured);
    // A copied local .env must not produce localhost image URLs on Vercel.
    if (!process.env.VERCEL_URL || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      return url;
    }
  }
  const deployment = process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    : process.env.VERCEL_URL;
  return new URL(deployment ? `https://${deployment}` : "http://localhost:3000");
}
