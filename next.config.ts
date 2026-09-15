import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      [
        "script-src 'self' 'unsafe-inline'",
        isDevelopment ? "'unsafe-eval'" : "",
        "https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      ].filter(Boolean).join(" "),
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://i.ytimg.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://api.notion.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel-insights.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      isDevelopment ? "" : "frame-ancestors 'none'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      isDevelopment ? "" : "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), accelerometer=(self), gyroscope=(self), magnetometer=(self)",
  },
  !isDevelopment
    ? {
      key: "X-Frame-Options",
      value: "DENY",
    }
    : null,
].filter((header): header is { key: string; value: string } => Boolean(header));

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
