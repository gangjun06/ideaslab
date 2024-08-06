const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  // reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', 'media.discordapp.net'],
  },
  // pageExtensions: ["page.tsx", "api.ts", "ts"],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*',
      },
    ]
  },
})

module.exports = nextConfig
