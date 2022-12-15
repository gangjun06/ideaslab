/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  // pageExtensions: ["page.tsx", "api.ts", "ts"],
}

module.exports = nextConfig
