/** @type {import('next').NextConfig} */

const dev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://substackcdn.com",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Inline the build's public origin so ISR uses the same sharing URLs.
  env: {
    SOCIAL_PREVIEW_ORIGIN:
      process.env.CONTEXT === "deploy-preview" && process.env.DEPLOY_PRIME_URL
        ? process.env.DEPLOY_PRIME_URL
        : "https://hydration.net",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "substackcdn.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
