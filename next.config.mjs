/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', 'bcryptjs', 'razorpay'],
  turbopack: {},
};

export default nextConfig;
