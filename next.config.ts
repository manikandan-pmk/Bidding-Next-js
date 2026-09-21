/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Next.js 14.0.4 and newer (including Next.js 15):
  serverExternalPackages: ["typeorm", "mysql2"],

  // If you are on an older Next.js 13 / early 14 version, use:
  // experimental: {
  //   serverComponentsExternalPackages: ["typeorm", "mysql2"],
  // },
};

module.exports = nextConfig;