/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Corrected: serverActions should be an object, even if empty
    serverActions: {}, 
  },
};

module.exports = nextConfig;
