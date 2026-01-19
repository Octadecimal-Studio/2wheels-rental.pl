/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2wheels-cms.octadecimal.studio',
        pathname: '/uploads/**',
      },
    ],
  },
  // Przekazanie zmiennej środowiskowej do klienta
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'https://2wheels-cms.octadecimal.studio',
  },
};

export default nextConfig;
