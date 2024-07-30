const prefix =
  process.env.NODE_ENV === 'production' ? 'https://keep-ones.me/freeder' : ''


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/freeder'
};

export default nextConfig;
