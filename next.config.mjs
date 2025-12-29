/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bilejdihnavpjtxgunro.supabase.co',
      },
    ],
  },
  // Next.js 16のinstrumentation機能を無効化（使用していない場合）
  experimental: {
    instrumentationHook: false,
  },
};

export default nextConfig;

