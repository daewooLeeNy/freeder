const prefix =
  process.env.NODE_ENV === 'production' ? 'https://keep-ones.me/mystudyshare' : ''


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: prefix
};

export default nextConfig;
