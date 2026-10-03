/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure pg works seamlessly with Next.js server bundling
      config.externals.push('pg', 'bcryptjs');
    }
    return config;
  },
};

export default nextConfig;
