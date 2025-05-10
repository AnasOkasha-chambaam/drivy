import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Add headers for Service Worker and Web Push
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
