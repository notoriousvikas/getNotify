/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:3000/api/v1/:path*",
      },
      {
        source: "/health",
        destination: "http://localhost:3000/health",
      },
    ];
  },
};

module.exports = nextConfig;
