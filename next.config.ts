import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async redirects() {
    return [
      { source: "/signin", destination: "/auth/sign-in", permanent: true },
      { source: "/signup", destination: "/auth/sign-up", permanent: true },
      { source: "/dashboard", destination: "/app", permanent: true },
      { source: "/login", destination: "/auth/sign-in", permanent: true },
      { source: "/learn/:path*", destination: "/app/:path*", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
